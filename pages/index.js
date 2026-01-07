import Link from 'next/link';

export default function Home() {
    const categories = [
        { name: 'بازارچه محصولات', href: '/seller-ads', icon: '🛍️', desc: 'خرید و فروش کالاهای نو و دست دوم', color: 'gradient-blue' },
        { name: 'کارجو', href: '/jobseeker-ads', icon: '👤', desc: 'خود را معرفی کنید', color: 'gradient-green' },
        { name: 'پروژه‌های دیجیتال', href: '/digital-ads', icon: '💻', desc: 'برنامه‌نویسی، طراحی و خدمات آنلاین', color: 'gradient-orange' },
        { name: 'کارفرما', href: '/employer-ads', icon: '💼', desc: 'خود و شرکت خود را معرفی کنید', color: 'gradient-pink' },
    ];

    return (
        <div className="home-wrapper">
            <header className="home-hero">
                <div className="hero-content">
                    <h1>پلتفرم هوشمند آگهی <span>رستاتک</span></h1>
                    <p>سریع‌ترین راه برای پیدا کردن آنچه به دنبالش هستید</p>
                    <div className="search-bar-mock">
                        <input type="text" placeholder="جستجو در بین ۳۲۰ آگهی فعال..." />
                        <button>جستجو</button>
                    </div>
                </div>
            </header>

            <section className="categories-section">
                <div className="section-title">
                    <h2>دسته‌بندی‌های اصلی</h2>
                    <div className="underline"></div>
                </div>

                <div className="services-grid">
                    {categories.map((cat, i) => (
                        <Link href={cat.href} key={i} className={`service-card ${cat.color}`}>
                            <div className="icon-wrapper">{cat.icon}</div>
                            <h3>{cat.name}</h3>
                            <p>{cat.desc}</p>
                            <span className="explore-link">ورود به بخش ←</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}