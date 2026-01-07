import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export default function JobSeekerPage() {
    const [ads, setAds] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Filters matching your Backend Controller
    const [skill, setSkill] = useState('');
    const [hasWorkSample, setHasWorkSample] = useState(''); 
    const [city, setCity] = useState('');
    const [time, setTime] = useState('');

    // --- INFINITE SCROLL LOGIC ---
    const observer = useRef();
    const lastAdElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Checkbox handler for "Work Sample"
    const handleCheckboxChange = (e) => {
        setHasWorkSample(e.target.checked ? 'بله' : '');
    };

    const fetchAds = async (isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const currentPage = isNewFilter ? 1 : page;
            const response = await axios.get(`http://localhost:5000/api/ads/jobseeker/`, {
                params: { 
                    page: currentPage, 
                    limit: 12, 
                    skill: skill || undefined,
                    hasWorkSample: hasWorkSample || undefined,
                    city: city || undefined,
                    time: time || undefined
                }
            });
            
            const { ads: newAds, hasMore: more } = response.data;
            
            if (isNewFilter) {
                setAds(newAds);
            } else {
                setAds(prev => [...prev, ...newAds]);
            }
            setHasMore(more);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchAds(true);
    }, [skill, hasWorkSample, city, time]);

    useEffect(() => {
        if (page > 1) fetchAds(false);
    }, [page]);

    return (
        <div className="marketplace-container">
            <header className="page-header">
                <h1>بانک رزومه <span>رستاتک</span></h1>
                <p>رزومه متخصصین و کارجویان آماده به کار</p>
            </header>

            <div className="content-layout">
                {/* Sidebar */}
                <aside className="filter-sidebar">
                    <div className="sidebar-inner">
                        <h3>فیلتر کارجویان</h3>
                        
                        {/* Skill Filter */}
                        <div className="filter-group">
                            <label>مهارت تخصصی</label>
                            <select onChange={(e) => setSkill(e.target.value)} value={skill}>
                                <option value="">همه مهارت‌ها</option>
                                <option value="React">React</option>
                                <option value="Node.js">Node.js</option>
                                <option value="Python">Python</option>
                                <option value="UI/UX">UI/UX</option>
                            </select>
                        </div>

                        {/* Checkbox for Work Sample */}
                        <div className="filter-group">
                            <label className="checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    checked={hasWorkSample === 'بله'}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="custom-checkbox"></span>
                                <span> دارای نمونه کار</span>
                            </label>
                        </div>

                        {/* City Filter */}
                        <div className="filter-group">
                            <label>شهر</label>
                            <select onChange={(e) => setCity(e.target.value)} value={city}>
                                <option value="">همه شهرها</option>
                                <option value="تهران">تهران</option>
                                <option value="مشهد">مشهد</option>
                                <option value="اصفهان">اصفهان</option>
                            </select>
                        </div>

                        {/* Time Filter */}
                        <div className="filter-group">
                            <label>زمان انتشار</label>
                            <select onChange={(e) => setTime(e.target.value)} value={time}>
                                <option value="">همه زمان‌ها</option>
                                <option value="امروز">امروز</option>
                                <option value="این هفته">این هفته</option>
                                <option value="این ماه">این ماه</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="main-feed">
                    <div className="product-grid">
                        {ads.map((ad, index) => {
                            const isLastAd = ads.length === index + 1;
                            return (
                                <div 
                                    key={ad._id} 
                                    className="product-card seeker-card" 
                                    ref={isLastAd ? lastAdElementRef : null}
                                >
                                    <div className="img-container">
                                        <img src={ad.imageUrl || 'https://via.placeholder.com/300x300'} alt={ad.name} />
                                    </div>

                                    <div className="card-content">
                                        <h2 className="product-title">{ad.name}</h2>
                                        
                                        {/* Display All Skills */}
                                        <div className="skill-tags">
                                            {ad.skills && ad.skills.map((s, i) => (
                                                <span key={i} className="skill-badge">{s}</span>
                                            ))}
                                        </div>

                                        <div className="location-info"> {ad.location}</div>
                                        
                                        <div className="card-footer job-card-footer">
                                            <div className="sample-status">
                                                {ad.hasSample ? ' دارای نمونه‌کار' : ' بدون نمونه‌کار'}
                                            </div>
                                            
                                            <span className="time-text left-align">
                                                {ad.timeAgo}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}