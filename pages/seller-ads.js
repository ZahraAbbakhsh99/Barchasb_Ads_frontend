import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export default function SellerPage() {
    const [ads, setAds] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Filters
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

    const fetchAds = async (isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const currentPage = isNewFilter ? 1 : page;
            const response = await axios.get(`http://localhost:5000/api/ads/seller/`, {
                params: { 
                    page: currentPage, 
                    limit: 12, 
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

    // Trigger on Filter Change
    useEffect(() => {
        setPage(1); // Reset page to 1
        fetchAds(true); // Fetch with new filter
    }, [city, time]);

    // Trigger on Scroll (Page change)
    useEffect(() => {
        if (page > 1) {
            fetchAds(false);
        }
    }, [page]);

    return (
        <div className="marketplace-container">
            <header className="page-header">
                <h1>بازارچه محصولات <span>رستاتک</span></h1>
                <p>نمایش تخصصی آگهی‌های خرید و فروش کالا</p>
            </header>

            <div className="content-layout">
                {/* Your Original Sidebar */}
                <aside className="filter-sidebar">
                    <div className="sidebar-inner">
                        <h3>جستجوی پیشرفته</h3>
                        <div className="filter-group">
                            <label>انتخاب شهر</label>
                            <select onChange={(e) => setCity(e.target.value)} value={city}>
                                <option value="">همه شهرها</option>
                                <option value="مبارکه">مبارکه</option>
                                <option value="مشهد">مشهد</option>
                                <option value="تهران">تهران</option>
                                <option value="شیراز">شیراز</option>
                            </select>
                        </div>
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
                                        <img src={ad.imageUrl || 'https://via.placeholder.com/400x300'} alt={ad.title} />
                                    </div>
                                    <div className="card-content">
                                        <h2 className="product-title">{ad.title}</h2>
                                        <div className="location-info">{ad.city || ad.location}</div>
                                        <div className="card-footer">
                                            <div className="product-price">
                                                {Number(ad.priceIRT || ad.price).toLocaleString('fa-IR')} <span>تومان</span>
                                                <span className="time-text">{ad.timeAgo || 'فوری'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Infinite Scroll Loader */}
                    {loading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>در حال دریافت آگهی‌های بیشتر...</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}