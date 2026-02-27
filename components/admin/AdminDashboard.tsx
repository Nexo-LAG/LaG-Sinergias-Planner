
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, ProjectObjective, Service } from '../../types';

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<{ categories: Category[], objectives: ProjectObjective[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/data')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(json => {
                console.log('Admin data loaded:', json);
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch data:', err);
                setError(`Failed to load data: ${err.message}`);
                setLoading(false);
            });
    };

    const handleSave = () => {
        if (!data) return;
        setSaving(true);
        fetch('/api/admin/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert('Data saved successfully!');
            } else {
                alert('Failed to save data');
            }
            setSaving(false);
        })
        .catch(err => {
            console.error('Error saving data:', err);
            alert('Error saving data');
            setSaving(false);
        });
    };

    const updateCategory = (index: number, field: keyof Category, value: string) => {
        if (!data) return;
        const newCategories = [...data.categories];
        newCategories[index] = { ...newCategories[index], [field]: value };
        setData({ ...data, categories: newCategories });
    };

    const updateServicePrice = (catIndex: number, subIndex: number, serviceIndex: number, tierIndex: number, newPrice: number) => {
        if (!data) return;
        const newCategories = [...data.categories];
        const category = newCategories[catIndex];
        const subcategory = category.subcategories[subIndex];
        const service = subcategory.services[serviceIndex];
        const tiers = [...service.tiers];
        
        tiers[tierIndex] = { ...tiers[tierIndex], price: newPrice };
        
        service.tiers = tiers;
        setData({ ...data, categories: newCategories });
    };

    const updateServiceDetails = (catIndex: number, subIndex: number, serviceIndex: number, field: keyof Service, value: string) => {
        if (!data) return;
        const newCategories = [...data.categories];
        const category = newCategories[catIndex];
        const subcategory = category.subcategories[subIndex];
        const service = subcategory.services[serviceIndex];
        
        // @ts-ignore
        service[field] = value;
        setData({ ...data, categories: newCategories });
    };

    const updateTierDetails = (catIndex: number, subIndex: number, serviceIndex: number, tierIndex: number, field: string, value: string | number) => {
        if (!data) return;
        const newCategories = [...data.categories];
        const category = newCategories[catIndex];
        const subcategory = category.subcategories[subIndex];
        const service = subcategory.services[serviceIndex];
        const tiers = [...service.tiers];
        
        // @ts-ignore
        tiers[tierIndex] = { ...tiers[tierIndex], [field]: value };
        
        service.tiers = tiers;
        setData({ ...data, categories: newCategories });
    };

    const addCategory = () => {
        if (!data) return;
        const newCategory: Category = {
            id: `new-cat-${Date.now()}`,
            title: 'New Category',
            description: 'Category description',
            subcategories: []
        };
        setData({ ...data, categories: [...data.categories, newCategory] });
        setExpandedCategory(newCategory.id);
    };

    const addSubcategory = (catIndex: number) => {
        if (!data) return;
        const newCategories = [...data.categories];
        const newSub: any = { // Using any temporarily to bypass strict type checking for new objects if needed, but structure matches
            id: `sub-${Date.now()}`,
            title: 'New Subcategory',
            services: []
        };
        newCategories[catIndex].subcategories.unshift(newSub); // Add to the beginning
        setData({ ...data, categories: newCategories });
    };

    const addService = (catIndex: number, subIndex: number) => {
        if (!data) return;
        const newCategories = [...data.categories];
        
        const newService: Service = {
            id: `svc-${Date.now()}`,
            name: 'New Service',
            description: 'Service description',
            stats: { brand: 0, conversion: 0, reach: 0 },
            relatedServiceIds: [],
            tiers: [
                {
                    id: 'essential',
                    name: 'Essential',
                    price: 0,
                    duration: 1,
                    unit: 'weeks',
                    description: 'Essential tier description',
                    resources: { photos: 0, videos: 0, posts: 0, hours: 0 }
                },
                {
                    id: 'pro',
                    name: 'Pro',
                    price: 0,
                    duration: 1,
                    unit: 'weeks',
                    description: 'Pro tier description',
                    resources: { photos: 0, videos: 0, posts: 0, hours: 0 }
                },
                {
                    id: 'premium',
                    name: 'Premium',
                    price: 0,
                    duration: 1,
                    unit: 'weeks',
                    description: 'Premium tier description',
                    resources: { photos: 0, videos: 0, posts: 0, hours: 0 }
                }
            ]
        };

        newCategories[catIndex].subcategories[subIndex].services.push(newService);
        setData({ ...data, categories: newCategories });
    };

    const [confirmAction, setConfirmAction] = useState<{ type: 'deleteCategory' | 'deleteSubcategory' | 'deleteService', indices: number[] } | null>(null);

    const deleteService = (catIndex: number, subIndex: number, serviceIndex: number) => {
        setConfirmAction({ type: 'deleteService', indices: [catIndex, subIndex, serviceIndex] });
    };

    const deleteSubcategory = (catIndex: number, subIndex: number) => {
        setConfirmAction({ type: 'deleteSubcategory', indices: [catIndex, subIndex] });
    };

    const deleteCategory = (catIndex: number) => {
        setConfirmAction({ type: 'deleteCategory', indices: [catIndex] });
    };

    const executeDelete = () => {
        if (!confirmAction || !data) return;
        const { type, indices } = confirmAction;
        const newCategories = [...data.categories];

        if (type === 'deleteService') {
            const [catIndex, subIndex, serviceIndex] = indices;
            newCategories[catIndex].subcategories[subIndex].services.splice(serviceIndex, 1);
        } else if (type === 'deleteSubcategory') {
            const [catIndex, subIndex] = indices;
            newCategories[catIndex].subcategories.splice(subIndex, 1);
        } else if (type === 'deleteCategory') {
            const [catIndex] = indices;
            newCategories.splice(catIndex, 1);
        }

        setData({ ...data, categories: newCategories });
        setConfirmAction(null);
    };

    const [draggedService, setDraggedService] = useState<{ catIndex: number, subIndex: number, serviceIndex: number } | null>(null);

    const handleDragStart = (e: React.DragEvent, catIndex: number, subIndex: number, serviceIndex: number) => {
        setDraggedService({ catIndex, subIndex, serviceIndex });
        e.dataTransfer.effectAllowed = 'move';
        // Set a transparent image or custom drag image if needed, but default is usually fine
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetCatIndex: number, targetSubIndex: number, targetServiceIndex: number) => {
        e.preventDefault();
        if (!draggedService || !data) return;

        // Only allow reordering within the same subcategory for now to avoid confusion
        if (draggedService.catIndex !== targetCatIndex || draggedService.subIndex !== targetSubIndex) {
            return;
        }

        if (draggedService.serviceIndex === targetServiceIndex) return;

        const newCategories = [...data.categories];
        const services = newCategories[targetCatIndex].subcategories[targetSubIndex].services;
        
        const [movedService] = services.splice(draggedService.serviceIndex, 1);
        services.splice(targetServiceIndex, 0, movedService);

        setData({ ...data, categories: newCategories });
        setDraggedService(null);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-xl font-mono animate-pulse">Loading admin panel...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={fetchData} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Retry</button>
            </div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#cd2027]"></div>
                    <h1 className="text-lg font-bold tracking-tight">La Grieta <span className="font-light text-gray-500">Admin</span></h1>
                </div>
                <div className="flex gap-3">
                    <Link to="/" className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors">Back to Planner</Link>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-wider text-white rounded transition-all ${saving ? 'bg-gray-400' : 'bg-black hover:bg-[#cd2027]'}`}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-light uppercase tracking-tight">Service Catalog</h2>
                        <span className="text-xs font-mono text-gray-400">{data.categories.length} Categories</span>
                    </div>
                    
                    <div className="space-y-4">
                        {data.categories.map((category, catIndex) => (
                            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                                <div 
                                    className="p-6 cursor-pointer flex justify-between items-center bg-gray-50/50"
                                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${expandedCategory === category.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {catIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{category.title}</h3>
                                            <p className="text-xs text-gray-400 font-mono">{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 flex items-center gap-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteCategory(catIndex); }}
                                            className="text-xs text-red-500 hover:text-red-700 uppercase font-bold px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        {expandedCategory === category.id ? '▼' : '▶'}
                                    </div>
                                </div>

                                {expandedCategory === category.id && (
                                    <div className="p-6 border-t border-gray-100 animate-fade">
                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category Title</label>
                                                <input 
                                                    value={category.title} 
                                                    onChange={(e) => updateCategory(catIndex, 'title', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm focus:border-black outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Description</label>
                                                <input 
                                                    value={category.description} 
                                                    onChange={(e) => updateCategory(catIndex, 'description', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm focus:border-black outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => addSubcategory(catIndex)}
                                            className="w-full py-4 mb-8 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-black transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            + Add Subcategory
                                        </button>

                                        <div className="space-y-6">
                                            {category.subcategories.map((sub, subIndex) => (
                                                <div key={sub.id} className="pl-4 border-l-2 border-gray-100">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <input 
                                                            value={sub.title}
                                                            onChange={(e) => {
                                                                const newCategories = [...data.categories];
                                                                newCategories[catIndex].subcategories[subIndex].title = e.target.value;
                                                                setData({ ...data, categories: newCategories });
                                                            }}
                                                            className="text-sm font-bold uppercase tracking-wider text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => addService(catIndex, subIndex)}
                                                                className="text-[10px] bg-gray-100 hover:bg-black hover:text-white px-3 py-1 rounded uppercase font-bold transition-colors"
                                                            >
                                                                + Add Service
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteSubcategory(catIndex, subIndex)}
                                                                className="text-[10px] text-red-400 hover:text-red-600 uppercase font-bold px-2"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {sub.services.map((service, serviceIndex) => (
                                                            <div 
                                                                key={service.id} 
                                                                className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors relative group ${draggedService?.serviceIndex === serviceIndex && draggedService?.subIndex === subIndex && draggedService?.catIndex === catIndex ? 'opacity-50 border-dashed border-black' : ''}`}
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, catIndex, subIndex, serviceIndex)}
                                                                onDragOver={handleDragOver}
                                                                onDrop={(e) => handleDrop(e, catIndex, subIndex, serviceIndex)}
                                                            >
                                                                <div className="absolute top-4 left-2 cursor-move text-gray-300 hover:text-gray-500 p-1" title="Drag to reorder">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                                    </svg>
                                                                </div>
                                                                <button 
                                                                    onClick={() => deleteService(catIndex, subIndex, serviceIndex)}
                                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="Delete Service"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <div className="flex justify-between items-start mb-4 pr-8 pl-6">
                                                                    <div className="w-full">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{service.id}</span>
                                                                            <input 
                                                                                value={service.name}
                                                                                onChange={(e) => updateServiceDetails(catIndex, subIndex, serviceIndex, 'name', e.target.value)}
                                                                                className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-200 focus:border-black outline-none transition-colors"
                                                                            />
                                                                        </div>
                                                                        <textarea 
                                                                            value={service.description}
                                                                            onChange={(e) => updateServiceDetails(catIndex, subIndex, serviceIndex, 'description', e.target.value)}
                                                                            className="w-full text-sm text-gray-500 bg-transparent border border-transparent hover:border-gray-200 focus:border-black rounded p-1 outline-none transition-colors resize-none"
                                                                            rows={2}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {service.tiers.map((tier, tierIndex) => (
                                                                        <div key={tier.id} className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                                                                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                                                                <span className="text-[10px] font-bold uppercase">{tier.name}</span>
                                                                            </div>
                                                                            
                                                                            <div className="space-y-2">
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <div>
                                                                                        <label className="text-[10px] text-gray-400 uppercase block">Price (€)</label>
                                                                                        <div className="relative">
                                                                                            <input 
                                                                                                type="number"
                                                                                                value={tier.price}
                                                                                                onChange={(e) => updateServicePrice(catIndex, subIndex, serviceIndex, tierIndex, parseInt(e.target.value) || 0)}
                                                                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm font-mono font-bold focus:border-black outline-none"
                                                                                            />
                                                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-purple-600 font-bold">
                                                                                                {(tier.price * 100).toLocaleString()} B1T$!
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[10px] text-purple-500 uppercase block font-bold">Bundle Price (€)</label>
                                                                                        <input 
                                                                                            type="number"
                                                                                            value={tier.discountPrice || ''}
                                                                                            placeholder="Optional"
                                                                                            onChange={(e) => updateTierDetails(catIndex, subIndex, serviceIndex, tierIndex, 'discountPrice', parseInt(e.target.value) || 0)}
                                                                                            className="w-full bg-white border border-purple-200 rounded px-2 py-1 text-sm font-mono font-bold focus:border-purple-500 outline-none text-purple-700 placeholder-purple-200"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <div>
                                                                                        <label className="text-[10px] text-gray-400 uppercase block">Duration</label>
                                                                                        <input 
                                                                                            type="number"
                                                                                            value={tier.duration}
                                                                                            onChange={(e) => updateTierDetails(catIndex, subIndex, serviceIndex, tierIndex, 'duration', parseInt(e.target.value) || 0)}
                                                                                            className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm font-mono focus:border-black outline-none"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[10px] text-gray-400 uppercase block">Unit</label>
                                                                                        <select 
                                                                                            value={tier.unit}
                                                                                            onChange={(e) => updateTierDetails(catIndex, subIndex, serviceIndex, tierIndex, 'unit', e.target.value)}
                                                                                            className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm font-mono focus:border-black outline-none"
                                                                                        >
                                                                                            <option value="days">Days</option>
                                                                                            <option value="weeks">Weeks</option>
                                                                                            <option value="hours">Hours</option>
                                                                                            <option value="months">Months</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <label className="text-[10px] text-gray-400 uppercase block">Description</label>
                                                                                    <textarea 
                                                                                        value={tier.description}
                                                                                        onChange={(e) => updateTierDetails(catIndex, subIndex, serviceIndex, tierIndex, 'description', e.target.value)}
                                                                                        className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-black outline-none resize-none"
                                                                                        rows={3}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            onClick={addCategory}
                            className="w-full py-6 bg-black text-white rounded-xl shadow-lg hover:bg-[#cd2027] transition-all flex items-center justify-center gap-3 group"
                        >
                            <span className="text-2xl font-light group-hover:scale-110 transition-transform">+</span>
                            <span className="font-bold uppercase tracking-widest">Add New Category</span>
                        </button>
                    </div>
                </section>
            </div>

            {confirmAction && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade">
                        <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to delete this {confirmAction.type === 'deleteCategory' ? 'category' : confirmAction.type === 'deleteSubcategory' ? 'subcategory' : 'service'}? 
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
