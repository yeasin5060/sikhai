import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Clapperboard, LoaderCircle, Play, Trash2, Upload, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getApiErrorMessage } from '../../utils/api.js';

const maxVideoSize = 100 * 1024 * 1024;

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.get('/videos')
      .then(({ data }) => { if (active) setVideos(data.videos); })
      .catch((error) => toast.error(getApiErrorMessage(error, 'ভিডিও তালিকা লোড করা যায়নি।')));
    return () => { active = false; };
  }, []);

  const uploadVideo = async (event) => {
    event.preventDefault();
    if (!file || !title.trim()) return;
    if (!file.type.startsWith('video/')) {
      toast.error('একটি ভিডিও ফাইল নির্বাচন করুন।');
      return;
    }
    if (file.size > maxVideoSize) {
      toast.error('ভিডিওটি ১০০ MB-এর মধ্যে রাখুন।');
      return;
    }

    setBusy(true);
    setProgress(0);
    try {
      const { data: uploadConfig } = await api.post('/videos/signature');
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('api_key', uploadConfig.apiKey);
      uploadForm.append('timestamp', uploadConfig.timestamp);
      uploadForm.append('public_id', uploadConfig.publicId);
      uploadForm.append('signature', uploadConfig.signature);

      const { data: uploaded } = await axios.post(
        `https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/video/upload`,
        uploadForm,
        {
          onUploadProgress: ({ loaded, total }) => {
            if (total) setProgress(Math.round((loaded / total) * 100));
          },
        },
      );
      const { data } = await api.post('/videos', {
        title: title.trim(),
        description: description.trim(),
        publicId: uploaded.public_id,
        videoUrl: uploaded.secure_url,
        duration: uploaded.duration,
      });
      setVideos((current) => [data.video, ...current]);
      setTitle('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('ক্লাস ভিডিও প্রকাশ হয়েছে।');
    } catch (error) {
      toast.error(getApiErrorMessage(error, error.response?.data?.error?.message || 'ভিডিও আপলোড করা যায়নি।'));
    } finally {
      setBusy(false);
    }
  };

  const removeVideo = async (video) => {
    if (!window.confirm(`“${video.title}” ভিডিওটি মুছে ফেলবেন?`)) return;
    try {
      await api.delete(`/videos/${video.id}`);
      setVideos((current) => current.filter((item) => item.id !== video.id));
      toast.success('ভিডিও মুছে ফেলা হয়েছে।');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ভিডিও মুছতে সমস্যা হয়েছে।'));
    }
  };

  return (
    <div className="class-video-manager">
      <section className="admin-table-card class-video-upload-card">
        <div className="table-heading">
          <div>
            <span className="class-video-eyebrow"><Clapperboard size={15} /> ভিডিও লাইব্রেরি</span>
            <h3>নতুন ক্লাস ভিডিও যোগ করুন</h3>
            <p>ভিডিওটি সরাসরি নিরাপদ cloud storage-এ আপলোড হবে এবং হোম পেজে দেখা যাবে।</p>
          </div>
          <span className="class-video-upload-icon"><Upload size={20} /></span>
        </div>
        <form className="class-video-form" onSubmit={uploadVideo}>
          <label>
            ভিডিওর শিরোনাম
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required placeholder="যেমন: HTML-এর প্রাথমিক ধারণা" />
          </label>
          <label>
            সংক্ষিপ্ত বিবরণ <span>(ঐচ্ছিক)</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1200} rows={3} placeholder="এই ক্লাসে কী শেখানো হবে লিখুন" />
          </label>
          <label className="class-video-file-label">
            <span>ভিডিও ফাইল <small>MP4, MOV, WebM · সর্বোচ্চ ১০০ MB</small></span>
            <input ref={fileInputRef} type="file" accept="video/*" required onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <button className="button button-primary" type="submit" disabled={busy || !file || !title.trim()}>
            {busy ? <><LoaderCircle className="class-video-spinner" size={17} /> আপলোড হচ্ছে {progress}%</> : <><Upload size={17} /> ভিডিও আপলোড ও প্রকাশ</>}
          </button>
          {busy && <div className="class-video-progress" aria-label={`আপলোড ${progress}%`}><span style={{ width: `${progress}%` }} /></div>}
        </form>
      </section>

      <section className="class-video-library">
        <div className="class-video-library-heading">
          <div><h3>প্রকাশিত ক্লাস ভিডিও</h3><p>হোম পেজে বর্তমানে {videos.length}টি ভিডিও দেখা যাচ্ছে</p></div>
          <span>{videos.length} <Video size={16} /></span>
        </div>
        {videos.length ? (
          <div className="class-video-admin-grid">
            {videos.map((video) => (
              <article className="class-video-admin-card" key={video.id}>
                <div className="class-video-admin-preview"><video src={video.videoUrl} poster={video.thumbnailUrl} preload="metadata" controls /></div>
                <div className="class-video-admin-copy"><h4>{video.title}</h4><p>{video.description || 'কোনো বিবরণ যোগ করা হয়নি।'}</p></div>
                <button type="button" className="class-video-delete" onClick={() => removeVideo(video)} aria-label={`${video.title} মুছুন`}><Trash2 size={17} /> মুছুন</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="class-video-empty"><span><Play size={20} /></span><b>এখনো কোনো ভিডিও নেই</b><p>প্রথম ক্লাস ভিডিও আপলোড করলে সেটি এখানে ও হোম পেজে দেখা যাবে।</p></div>
        )}
      </section>
    </div>
  );
}
