// src/app/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import API from '../lib/api'
import styles from '../styles/HomeHero.module.css'

export default function HomePage() {
  const [rooms, setRooms] = useState([])

  // static placeholder news
  const placeholderNews = [
    {
      imageUrl: '/news-1.jpg',
      source: 'CNN',
      title: 'Italy: Venice seeks more investment in the real estate…',
      date: 'May 2, 2025',
    },
    {
      imageUrl: '/news-2.jpg',
      source: 'BBC',
      title: 'United States, the economy of Central America in flux',
      date: 'May 1, 2025',
    },
    {
      imageUrl: '/news-3.jpg',
      source: 'The New York Times',
      title: 'The role of the real estate sector in global markets',
      date: 'Apr 30, 2025',
    },
  ]
  const [news] = useState(placeholderNews)

  useEffect(() => {
    API.get('/rooms?limit=4')
      .then(res => setRooms(res.data.rooms))
      .catch(() => setRooms([]))
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The ease of buying a dream hotel
          </h1>
          <p className={styles.heroSubtitle}>
            Find your perfect property investment around the world
          </p>
          <form className={styles.searchForm}>
            <select className={styles.searchSelect}>
              <option value="">Country</option>
              <option>USA</option>
              <option>Italy</option>
            </select>
            <select className={styles.searchSelect}>
              <option value="">City</option>
              <option>Miami</option>
              <option>Venice</option>
            </select>
            <select className={styles.searchSelect}>
              <option value="">Property Type</option>
              <option>Hotel</option>
            </select>
            <select className={styles.searchSelect}>
              <option value="">Price Range</option>
              <option>$1M–$5M</option>
            </select>
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* New hotels */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>New hotels</h2>
        <div className={styles.roomsGrid}>
          {rooms.map(r => (
            <Link key={r._id} href={`/rooms/${r._id}`}>
              <div className={styles.roomCard}>
                {r.images?.[0] ? (
                  <Image
                    src={r.images[0]}
                    alt={r.title}
                    width={400}
                    height={180}
                    className={styles.roomImage}
                    unoptimized
                  />
                ) : (
                  <div style={{ height: 180, background: '#f0f0f0' }} />
                )}
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomTitle}>{r.title}</h3>
                  <div className={styles.roomMeta}>
                    <span className={styles.roomPrice}>
                      ${r.price.toLocaleString()}
                    </span>
                    <span className={styles.roomCapacity}>
                      {r.capacity} guest{r.capacity > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today news */}
      <section className={styles.newsSection}>
        <h2 className={styles.sectionTitle}>Today news</h2>
        <div className={styles.newsGrid}>
          {news.map((item, idx) => (
            <div key={idx} className={styles.newsCard}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={400}
                height={200}
                className={styles.newsImage}
                unoptimized
              />
              <div className={styles.newsInfo}>
                <span className={styles.newsSource}>{item.source}</span>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsDate}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/news" className={styles.moreLink}>
          More news…
        </Link>
      </section>

      {/* Our services */}
      <section className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Our services</h2>
        <div className={styles.servicesGrid}>
          {[
            { title: 'Selling Hotels', icon: '/icons/hotel.svg' },
            { title: 'Hotel Investments', icon: '/icons/invest.svg' },
            { title: 'Management Services', icon: '/icons/management.svg' },
          ].map((s, i) => (
            <div key={i} className={styles.serviceCard}>
              <Image src={s.icon} alt="" width={48} height={48} />
              <h3 className={styles.serviceTitle}>{s.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section className={styles.subscribeSection}>
        <div className={styles.subscribeInner}>
          <div className={styles.partners}>
            {['marriott','hilton','marriott','hilton','marriott'].map((p,i) => (
              <Image
                key={i}
                src={`/logos/${p}.svg`}
                alt={p}
                width={100}
                height={40}
              />
            ))}
          </div>
          <h2 className={styles.subscribeTitle}>
            Subscribe & get news and top hotels
          </h2>
          <p className={styles.subscribeText}>
            At the moment of subscribing you accept to be a VIP member…
          </p>
          <form className={styles.subscribeForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.subscribeInput}
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscription
            </button>
          </form>
        </div>
      </section>

      {/* Sell */}
      <section className={styles.sellSection}>
        <div className={styles.sellInner}>
          <h2 className={styles.sellTitle}>
            If you have a hotel that you want to sell, we sell it for you.
          </h2>
          <Link href="/sell" className={styles.sellButton}>
            Start here…
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <h4>Zolutto</h4>
            <p>Tel: (+504) 2276-0010</p>
            <p>Mov: (+504) 2276-0010</p>
            <p>Email: info@zolutto.com</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Menu</h4>
            <Link href="/">Home</Link>
            <Link href="/rooms">Hotels for sale</Link>
            <Link href="/news">News</Link>
            <Link href="/contacts">Contacts</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Our Partners</h4>
            <p>Hilton</p>
            <p>Marriott</p>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerNote}>
              We have a specialized team of professionals…
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>by beansario</div>
      </footer>
    </main>
)
}
