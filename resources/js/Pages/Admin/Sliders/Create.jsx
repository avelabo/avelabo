import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Create() {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        description: '',
        image: null,
        button_text: '',
        button_link: '',
        text_options: {
            text_align: 'left',
            text_vertical: 'center',
            title_color: '#ffffff',
            subtitle_color: '#ffffffcc',
            description_color: '#ffffffb3',
            button_bg_color: '#2a2a2a',
            button_text_color: '#ffffff',
        },
        sort_order: 0,
        is_active: true,
    });

    const setTextOption = (key, value) => {
        setData('text_options', { ...data.text_options, [key]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.sliders.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Slider" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.sliders.index')}
                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                    >
                        <span className="material-icons">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Create Slider</h2>
                        <p className="text-body">Add a new homepage hero slider</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Slider Content</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter slider title"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter slider subtitle"
                                    />
                                    {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter slider description"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Button Settings */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Button Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={data.button_text}
                                        onChange={(e) => setData('button_text', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="e.g., Shop Now"
                                    />
                                    {errors.button_text && <p className="text-red-500 text-sm mt-1">{errors.button_text}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Button Link
                                    </label>
                                    <input
                                        type="text"
                                        value={data.button_link}
                                        onChange={(e) => setData('button_link', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="e.g., /shop or https://..."
                                    />
                                    {errors.button_link && <p className="text-red-500 text-sm mt-1">{errors.button_link}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Text Position & Colors */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Text Position & Colors</h3>

                            <div className="space-y-5">
                                {/* Horizontal Alignment */}
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                        Horizontal Alignment
                                    </label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'left', icon: 'format_align_left' },
                                            { value: 'center', icon: 'format_align_center' },
                                            { value: 'right', icon: 'format_align_right' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setTextOption('text_align', opt.value)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    data.text_options.text_align === opt.value
                                                        ? 'bg-brand text-white'
                                                        : 'bg-gray-100 dark:bg-dark-body text-body hover:text-heading dark:hover:text-white'
                                                }`}
                                            >
                                                <span className="material-icons text-lg">{opt.icon}</span>
                                                {opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Vertical Alignment */}
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                        Vertical Alignment
                                    </label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'top', icon: 'vertical_align_top' },
                                            { value: 'center', icon: 'vertical_align_center' },
                                            { value: 'bottom', icon: 'vertical_align_bottom' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setTextOption('text_vertical', opt.value)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    data.text_options.text_vertical === opt.value
                                                        ? 'bg-brand text-white'
                                                        : 'bg-gray-100 dark:bg-dark-body text-body hover:text-heading dark:hover:text-white'
                                                }`}
                                            >
                                                <span className="material-icons text-lg">{opt.icon}</span>
                                                {opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'title_color', label: 'Title Color' },
                                        { key: 'subtitle_color', label: 'Subtitle Color' },
                                        { key: 'description_color', label: 'Description Color' },
                                        { key: 'button_bg_color', label: 'Button Background' },
                                        { key: 'button_text_color', label: 'Button Text Color' },
                                    ].map((color) => (
                                        <div key={color.key}>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                                {color.label}
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={data.text_options[color.key]?.slice(0, 7) || '#ffffff'}
                                                    onChange={(e) => setTextOption(color.key, e.target.value)}
                                                    className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.text_options[color.key] || ''}
                                                    onChange={(e) => setTextOption(color.key, e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                                    placeholder="#ffffff"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Slider Image</h3>

                            <div className="space-y-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setData('image', null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                        <span className="material-icons text-4xl text-gray-400 mb-2">cloud_upload</span>
                                        <span className="text-sm text-body">Click to upload image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        min="0"
                                    />
                                    {errors.sort_order && <p className="text-red-500 text-sm mt-1">{errors.sort_order}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-heading dark:text-white">
                                        Active
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.is_active ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                data.is_active ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <span className="material-icons animate-spin text-lg">refresh</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-lg">save</span>
                                            Create Slider
                                        </>
                                    )}
                                </button>
                                <Link
                                    href={route('admin.sliders.index')}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body text-body hover:text-heading dark:hover:text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
