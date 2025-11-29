import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index() {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const reviews = [
        { id: 23, product: 'Organic Quinoa, Brown, & Red Rice', name: 'Devon Lane', rating: 3, date: '10.03.2020' },
        { id: 24, product: 'All Natural Italian-Style', name: 'Guy Hawkins', rating: 4, date: '04.12.2019' },
        { id: 25, product: "Angie's Boomchickapop Sweet", name: 'Steven John', rating: 4.5, date: '25.05.2020' },
        { id: 26, product: 'Foster Farms Takeout Crispy Classic', name: 'Kristin Watson', rating: 4.5, date: '01.06.2020' },
        { id: 27, product: 'Blue Diamond Almonds Lightly Salted', name: 'Jane Cooper', rating: 5, date: '13.03.2020' },
        { id: 28, product: 'Chobani Complete Vanilla Greek Yogurt', name: 'Courtney Henry', rating: 5, date: '21.02.2020' },
        { id: 29, product: 'Canada Dry Ginger Ale - 2 L Bottle', name: 'Ralph Edwards', rating: 4.5, date: '23.03.2020' },
        { id: 30, product: 'Encore Seafoods Stuffed Alaskan', name: 'Courtney Henry', rating: 3.5, date: '20.02.2020' },
    ];

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="material-icons text-lg text-accent">star</span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="material-icons text-lg text-accent">star_half</span>
                );
            } else {
                stars.push(
                    <span key={i} className="material-icons text-lg text-gray-300">star</span>
                );
            }
        }
        return stars;
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(reviews.map(r => r.id));
        }
        setSelectAll(!selectAll);
    };

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Reviews" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Reviews</h2>
                        <p className="text-body">Manage customer reviews</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                        />
                    </div>
                </div>

                {/* Reviews Table Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    {/* Filters Header */}
                    <header className="p-5 border-b dark:border-white/10">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            />
                            <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                <option>Status</option>
                                <option>Active</option>
                                <option>Disabled</option>
                                <option>Show all</option>
                            </select>
                            <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                <option>Show 20</option>
                                <option>Show 30</option>
                                <option>Show 40</option>
                            </select>
                        </div>
                    </header>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="py-3 px-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                        />
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">#ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Product</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Rating</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Date</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-body uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(review.id)}
                                                onChange={() => toggleItem(review.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm">{review.id}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-heading dark:text-white">{review.product}</td>
                                        <td className="py-3 px-4 text-sm">{review.name}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{review.date}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/reviews/${review.id}`}
                                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-body dark:hover:bg-white/10 text-heading dark:text-white rounded text-xs font-medium transition-colors"
                                                >
                                                    Detail
                                                </Link>
                                                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                                                    <span className="material-icons text-lg">more_horiz</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-start">
                    <nav className="flex items-center gap-1">
                        <button className="px-3 py-2 bg-brand text-white rounded text-sm font-medium">01</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">02</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">03</button>
                        <span className="px-3 py-2 text-body text-sm">...</span>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">16</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </div>
        </AdminLayout>
    );
}
