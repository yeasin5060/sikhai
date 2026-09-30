import { createHash, randomUUID } from 'node:crypto';
import ClassVideo from '../models/ClassVideo.js';

const videoFolder = 'shikhai/class-videos';

function getCloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error('Video uploads are not configured on the server');
    error.status = 503;
    throw error;
  }
  return { cloudName, apiKey, apiSecret };
}

function signCloudinaryParams(params, apiSecret) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

export async function createVideoUploadSignature(_req, res) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${videoFolder}/${randomUUID()}`;
  const params = { public_id: publicId, timestamp };
  return res.json({
    cloudName,
    apiKey,
    timestamp,
    publicId,
    signature: signCloudinaryParams(params, apiSecret),
  });
}

export async function listVideos(_req, res) {
  const videos = await ClassVideo.find().sort({ createdAt: -1 }).lean();
  return res.json({ videos: videos.map(({ _id, ...video }) => ({ id: String(_id), ...video })) });
}

export async function createVideo(req, res) {
  const { cloudName } = getCloudinaryConfig();
  const { title, description = '', publicId, videoUrl, duration = 0 } = req.body || {};
  if (!title?.trim() || !publicId || !videoUrl) {
    return res.status(400).json({ message: 'Title and uploaded video are required' });
  }
  if (!publicId.startsWith(`${videoFolder}/`)) {
    return res.status(400).json({ message: 'Video was not uploaded to the class video folder' });
  }
  let uploadedUrl;
  try {
    uploadedUrl = new URL(videoUrl);
  } catch {
    return res.status(400).json({ message: 'Invalid video URL' });
  }
  if (uploadedUrl.hostname !== 'res.cloudinary.com' ||
      !uploadedUrl.pathname.startsWith(`/${cloudName}/video/upload/`)) {
    return res.status(400).json({ message: 'Video URL is not from the configured video library' });
  }

  const thumbnailUrl = videoUrl.replace(
    '/video/upload/',
    '/video/upload/so_0,w_720,h_405,c_fill,q_auto,f_jpg/',
  );
  const video = await ClassVideo.create({
    title: title.trim(),
    description: description.trim(),
    publicId,
    videoUrl,
    thumbnailUrl,
    duration: Math.max(0, Number(duration) || 0),
    uploadedBy: req.user._id,
  });
  return res.status(201).json({ video });
}

export async function deleteVideo(req, res) {
  const video = await ClassVideo.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Class video not found' });
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { invalidate: 'true', public_id: video.publicId, timestamp };
  const body = new URLSearchParams({
    ...params,
    api_key: apiKey,
    signature: signCloudinaryParams(params, apiSecret),
    invalidate: 'true',
  });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/destroy`, {
    method: 'POST',
    body,
  });
  const result = await response.json();
  if (!response.ok || result.result !== 'ok' && result.result !== 'not found') {
    const error = new Error('Could not delete the video from storage');
    error.status = 502;
    throw error;
  }
  await video.deleteOne();
  return res.json({ success: true });
}
