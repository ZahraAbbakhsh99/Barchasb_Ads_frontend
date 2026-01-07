import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export default function DigitalAdsPage() {
    const [ads, setAds] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Filters for Digital Projects
    const [category, setCategory] = useState('');
    const [time, setTime] = useState('');
    const [budgetRange, setBudgetRange] = useState(''); // e.g., "low", "medium", "high"

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
            const response = await axios.get(`http://localhost:5000/api/ads/digital/`, {
                params: { 
                    page: currentPage, 
                    limit: 12, 
                    category: category || undefined,
                    budget: budgetRange || undefined,
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
    }, [category, budgetRange, time]);

    useEffect(() => {
        if (page > 1) fetchAds(false);
    }, [page]);

    return (
        <div className="marketplace-container">
            <header className="page-header">
                <h1>پروژه‌های <span>دیجیتال</span></h1>
                <p>برون‌سپاری پروژه‌های تخصصی و فریلنسری</p>
            </header>

            <div className="content-layout">
                <aside className="filter-sidebar">
                    <div className="sidebar-inner">
                        <h3>فیلتر پروژه‌ها</h3>
                        
                        <div className="filter-group">
                            <label>دسته بندی</label>
                            <select onChange={(e) => setCategory(e.target.value)} value={category}>
                                <option value="">همه حوزه‌ها</option>
                                <option value="طراحی سایت">طراحی سایت</option>
                                <option value="تولید محتوا">تولید محتوا</option>
                                <option value="سئو">سئو</option>
                                <option value="اپلیکیشن">اپلیکیشن</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>محدوده بودجه</label>
                            <select onChange={(e) => setBudgetRange(e.target.value)} value={budgetRange}>
                                <option value="">همه مبالغ</option>
                                <option value="low">اقتصادی</option>
                                <option value="medium">متوسط</option>
                                <option value="high">حرفه‌ای</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>زمان</label>
                            <select onChange={(e) => setTime(e.target.value)} value={time}>
                                <option value="">همه زمان‌ها</option>
                                <option value="امروز">امروز</option>
                                <option value="این هفته">این هفته</option>
                                <option value="این ماه">این ماه</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <main className="main-feed">
                    <div className="product-grid">
                        {ads.map((ad, index) => {
                            const isLastAd = ads.length === index + 1;
                            return (
                                <div 
                                    key={ad._id} 
                                    className="product-card digital-card" 
                                    ref={isLastAd ? lastAdElementRef : null}
                                >
                                    <div className="img-container">
                                        <img src={ad.imageUrl || 'https://via.placeholder.com/400x250'} alt={ad.title} />
                                        <span className="project-type-badge">پروژه‌ای</span>
                                    </div>

                                    <div className="card-content">
                                        <div className="project-category">{ad.category}</div>
                                        <h2 className="product-title">{ad.title}</h2>
                                        
                                        <div className="budget-box">
                                            <span>بودجه برآوردی:</span>
                                            <div className="budget-amount">{ad.minBudget} تا {ad.maxBudget} تومان</div>
                                        </div>
                                        
                                        <div className="card-footer job-card-footer">
                                            <div className="bid-count">📩 ۳ پیشنهاد</div>
                                            <span className="time-text left-align">{ad.timeAgo}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {loading && <div className="loading-spinner"><div className="spinner"></div></div>}
                </main>
            </div>
        </div>
    );
}