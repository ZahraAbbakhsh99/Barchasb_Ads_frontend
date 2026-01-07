import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export default function EmployerPage() {
    const [ads, setAds] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Filters matching your Backend Controller keys
    const [category, setCategory] = useState('');
    const [cooperationType, setCooperationType] = useState('');
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

    const fetchAds = async (isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const currentPage = isNewFilter ? 1 : page;
            const response = await axios.get(`http://localhost:5000/api/ads/employer/`, {
                params: { 
                    page: currentPage, 
                    limit: 12, 
                    category: category || undefined, 
                    cooperationType: cooperationType || undefined,
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

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(1);
        fetchAds(true);
    }, [category, cooperationType, time]);

    // Fetch next page when page state increments
    useEffect(() => {
        if (page > 1) {
            fetchAds(false);
        }
    }, [page]);

    return (
        <div className="marketplace-container">
            <header className="page-header">
                <h1>آگهی کارفرمایان <span>رستاتک</span></h1>
                <p>نمایش تخصصی آگهی‌های کارفرمایان</p>
            </header>

            <div className="content-layout">
                {/* Fixed Sidebar with your 3 specific filters */}
                <aside className="filter-sidebar">
                    <div className="sidebar-inner">
                        <h3>جستجوی پیشرفته</h3>
                        
                        {/* 1. Category Filter */}
                        <div className="filter-group">
                            <label>دسته‌بندی شغلی</label>
                            <select onChange={(e) => setCategory(e.target.value)} value={category}>
                                <option value="">همه حوزه‌ها</option>
                                <option value="برنامه‌نویسی">برنامه‌نویسی</option>
                                <option value="گرافیک">گرافیک</option>
                                <option value="بازاریابی">بازاریابی</option>
                                <option value="مدیریت">مدیریت</option>
                            </select>
                        </div>

                        {/* 2. Cooperation Type Filter */}
                        <div className="filter-group">
                            <label>نوع همکاری</label>
                            <select onChange={(e) => setCooperationType(e.target.value)} value={cooperationType}>
                                <option value="">همه موارد</option>
                                <option value="تمام وقت">تمام وقت</option>
                                <option value="پاره وقت">پاره وقت</option>
                                <option value="دورکاری">دورکاری</option>
                                <option value="کارآموزی">کارآموزی</option>
                            </select>
                        </div>

                        {/* 3. Time (TimeAgo) Filter */}
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

                {/* Grid Main Content */}
                <main className="main-feed">
                    <div className="product-grid">
                        {ads.map((ad, index) => {
                            const isLastAd = ads.length === index + 1;
                            return (
                                <div 
                                    key={ad._id} 
                                    className="product-card" 
                                    ref={isLastAd ? lastAdElementRef : null}
                                >
                                    <div className="img-container">
                                        <img src={ad.imageUrl || 'https://via.placeholder.com/400x300'} alt={ad.name} />
                                    </div>
                                    <div className="card-content">
                                        {/* Name & Multi-item Categories */}
                                        <div className="employer-meta">
                                            <span className="employer-name">{ad.name}</span>
                                            <span className="employer-cats">
                                                {Array.isArray(ad.categories) ? ad.categories.join(' ، ') : ad.categories}
                                            </span>
                                        </div>
                                        
                                        {/* State and City combined */}
                                        <div className="location-info">{ad.location}</div>
                                        
                                        <div className="card-footer job-card-footer">
                                            {/* Right side: Cooperation Type */}
                                            <div className="coop-type-tag">
                                                {ad.cooperationType}
                                            </div>
                                            
                                            {/* Left side: Time Ago */}
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