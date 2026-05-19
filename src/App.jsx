import React, { useState, useEffect, useMemo } from 'react';
import jusAlpukatImage from './assets/jusAlpukat.png';

import { 
  Home, 
  Search, 
  PlusSquare, 
  Flame, 
  Bookmark, 
  ChevronLeft, 
  Clock, 
  Users, 
  Star, 
  Camera, 
  CheckCircle,
  X,
  Plus,
  Minus,
  ChefHat,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Send,
  AlertCircle,
  Grid,
  Trash2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_RECIPES = [
  {
    id: '1',
    title: 'Avocado Juice',
    author: 'HealthySam',
    calories: 350,
    duration: { hours: 0, minutes: 15 },
    servings: 1,
    cuisine: 'Breakfast',
    ingredients: [
      { name: 'Roti gandum', amount: 1, unit: 'lembar' },
      { name: 'Alpukat matang', amount: 0.5, unit: 'buah' },
      { name: 'Telur Ayam', amount: 1, unit: 'butir' }
    ],
    steps: ['Panggang roti.', 'Hancurkan alpukat dan oleskan.', 'Masak telur dan taruh di atasnya.'],
    rating: 4.8,
    reviews: [
      { id: 1, user: 'FitLife99', rating: 5, comment: 'Sarapan sempurna! Mengenyangkan.' }
    ],
    image: catttImage,
  }
];

const UNITS = ['gr', 'kg', 'sdm', 'sdt', 'ml', 'liter', 'buah', 'lembar', 'butir', 'secukupnya'];

// --- Helper Functions ---
const formatDuration = (duration) => {
  if (!duration) return '0 mnt';
  const h = duration.hours > 0 ? `${duration.hours} jam ` : '';
  const m = duration.minutes > 0 ? `${duration.minutes} mnt` : '';
  return (h + m).trim() || '0 mnt';
};

// --- Sub-Components ---

const Card = ({ children, onClick, className = "" }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden active:scale-[0.98] transition-transform ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", full = false, disabled = false }) => {
  const styles = {
    primary: 'bg-orange-500 text-white shadow-orange-200',
    secondary: 'bg-orange-100 text-orange-600',
    outline: 'border-2 border-slate-200 text-slate-600',
    ghost: 'text-slate-500'
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl font-semibold transition-all active:opacity-70 flex items-center justify-center gap-2 ${styles[variant]} ${full ? 'w-full' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Pages ---

const Feed = ({ recipes, onSelect, onBookmark, bookmarks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Halo, Foodie! 👋</h1>
          <p className="text-slate-500 text-sm">Temukan makanan sehatmu hari ini</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
          <ChefHat size={24} />
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari resep, masakan..." 
          className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-300 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Rekomendasi</h2>
          <button className="text-orange-500 text-sm font-semibold">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(recipe => (
            <Card key={recipe.id} onClick={() => onSelect(recipe)}>
              <div className="relative h-48">
                <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
                <button 
                  onClick={(e) => { e.stopPropagation(); onBookmark(recipe.id); }}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-orange-500"
                >
                  <Bookmark size={20} fill={bookmarks.includes(recipe.id) ? "currentColor" : "none"} />
                </button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" /> {recipe.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-lg">{recipe.title}</h3>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">{recipe.cuisine}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  <span className="flex items-center gap-1"><Clock size={14}/> {formatDuration(recipe.duration)}</span>
                  <span className="flex items-center gap-1"><Flame size={14}/> {recipe.calories} kcal</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecipeDetail = ({ recipe, onBack, onCook, bookmarks, onBookmark, onAddReview }) => {
  const [servings, setServings] = useState(recipe.servings);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const ratio = servings / recipe.servings;

  const handleSubmitReview = () => {
    onAddReview(recipe.id, {
      id: Date.now(),
      user: 'Anda',
      rating: userRating,
      comment: comment.trim() || null
    });
    setComment('');
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto pb-32">
      <div className="relative h-80">
        <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-lg">
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => onBookmark(recipe.id)}
          className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg text-orange-500"
        >
          <Bookmark size={24} fill={bookmarks.includes(recipe.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="px-6 -mt-8 relative bg-white rounded-t-[32px] pt-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{recipe.title}</h1>
          <p className="text-slate-500 italic mb-4">Oleh {recipe.author}</p>
          <div className="flex gap-6 py-4 border-y border-slate-100">
            <div className="text-center flex-1">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Waktu</p>
              <p className="font-bold text-slate-700">{formatDuration(recipe.duration)}</p>
            </div>
            <div className="text-center flex-1 border-x border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Kalori</p>
              <p className="font-bold text-orange-500">{Math.round(recipe.calories * ratio)} kcal</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rating</p>
              <p className="font-bold text-slate-700">{recipe.rating} ({recipe.reviews?.length || 0})</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
          <span className="font-bold text-slate-700">Sesuaikan Porsi</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setServings(Math.max(1, servings - 1))} className="p-1 bg-white rounded shadow-sm"><Minus size={18}/></button>
            <span className="font-bold text-lg min-w-[20px] text-center">{servings}</span>
            <button onClick={() => setServings(servings + 1)} className="p-1 bg-white rounded shadow-sm"><Plus size={18}/></button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Bahan-bahan</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between items-center text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                <span>{ing.name}</span>
                <span className="font-bold text-slate-800">
                   {ing.unit === 'secukupnya' ? 'Secukupnya' : `${(ing.amount * ratio).toFixed(1)} ${ing.unit}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Cara Membuat</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                <p className="text-slate-600 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <Button full onClick={() => { onCook(recipe.title, Math.round(recipe.calories * ratio)); onBack(); }}>
          <CheckCircle size={20} /> Saya Masak Ini! (+{Math.round(recipe.calories * ratio)} kcal)
        </Button>

        {/* Reviews Section */}
        <div className="pt-4 space-y-6">
          <h2 className="text-xl font-bold">Ulasan ({recipe.reviews?.length || 0})</h2>
          <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setUserRating(star)}>
                  <Star size={24} className={star <= userRating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"} />
                </button>
              ))}
              <span className="ml-auto text-xs font-bold text-slate-400">Ketuk bintang untuk memberi rating</span>
            </div>
            <div className="relative">
              <textarea 
                placeholder="Bagikan pengalamanmu (opsional)..." 
                className="w-full p-3 bg-white border-none rounded-xl text-sm min-h-[80px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleSubmitReview} className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-lg shadow-sm">
                <Send size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {recipe.reviews?.map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">{rev.user}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                {rev.comment && <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CalorieTracker = ({ intakeHistory, onAddManual }) => {
  const goal = 2000;
  const dailyTotal = intakeHistory.reduce((acc, curr) => acc + curr.calories, 0);
  const percentage = Math.min((dailyTotal / goal) * 100, 100);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState('Medium');

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: 'Smoothie Berry Campur',
        baseCalories: 245,
        confidence: '94%'
      });
      setSelectedPortion('Medium');
    }, 2000);
  };

  const getCalculatedCalories = () => {
    if (!scanResult) return 0;
    if (selectedPortion === 'Small') return Math.round(scanResult.baseCalories * 0.7);
    if (selectedPortion === 'Large') return Math.round(scanResult.baseCalories * 1.4);
    return scanResult.baseCalories;
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-800">Pelacak Kesehatan</h1>

      <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="opacity-80 text-sm">Intake Hari Ini</p>
            <h2 className="text-4xl font-black">{dailyTotal} <span className="text-lg font-normal">kcal</span></h2>
          </div>
          <div className="text-right">
            <p className="opacity-80 text-sm">Target Harian</p>
            <h2 className="text-xl font-bold">{goal} kcal</h2>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-white transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-xs text-white/80">{Math.round(percentage)}% dari target harian tercapai</p>
      </Card>

      <Button variant="secondary" onClick={simulateScan} className="h-32 w-full flex-col">
        <Camera size={32} />
        <span className="font-bold">Scan Makanan AI</span>
      </Button>

      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Clock size={20} className="text-orange-500" /> Riwayat Makan
        </h3>
        {intakeHistory.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-slate-400 italic text-sm">
            Belum ada makanan hari ini.
          </div>
        ) : (
          <div className="space-y-3">
            {intakeHistory.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Dikonsumsi baru saja</p>
                </div>
                <span className="font-black text-orange-500">+{item.calories} kcal</span>
              </div>
            )).reverse()}
          </div>
        )}
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative mb-8 overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)] animate-scan"></div>
            <img src="https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-50" alt="Scanning Preview" />
          </div>
          <h2 className="text-xl font-bold animate-pulse">Menganalisis Makanan...</h2>
        </div>
      )}

      {scanResult && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-white w-full rounded-t-[32px] p-6 pb-12 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Makanan Dikenali!</h2>
              <button onClick={() => setScanResult(null)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                {scanResult.confidence}
              </div>
              <div>
                <h3 className="font-bold text-lg">{scanResult.name}</h3>
                <p className="text-orange-600 font-bold">{getCalculatedCalories()} Kalori</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pilih Ukuran Porsi:</p>
              <div className="flex gap-2">
                {['Small', 'Medium', 'Large'].map(portion => (
                  <button 
                    key={portion} 
                    onClick={() => setSelectedPortion(portion)}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${selectedPortion === portion ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400 bg-white'}`}
                  >
                    {portion}
                  </button>
                ))}
              </div>
            </div>

            <Button full onClick={() => { onAddManual(scanResult.name, getCalculatedCalories()); setScanResult(null); }}>
              Tambahkan ke Riwayat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateRecipe = ({ onAddRecipe, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    cuisine: '',
    calories: '',
    durationHours: 0,
    durationMinutes: 0,
    servings: 1,
    image: null
  });
  
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: 'gr' }]);
  const [steps, setSteps] = useState(['']);

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '', unit: 'gr' }]);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const isFormValid = useMemo(() => {
    const hasImage = formData.image !== null;
    const hasTitle = formData.title.trim().length > 0;
    const hasCuisine = formData.cuisine.trim().length > 0;
    const hasDuration = (formData.durationHours > 0 || formData.durationMinutes > 0);
    
    const hasIngredients = ingredients.length > 0 && ingredients.every(i => {
      const nameOk = i.name.trim().length > 0;
      const amountOk = i.unit === 'secukupnya' ? true : (parseFloat(i.amount) > 0);
      return nameOk && amountOk;
    });

    const hasSteps = steps.length > 0 && steps.some(s => s.trim().length > 0);
    
    return hasImage && hasTitle && hasCuisine && hasDuration && hasIngredients && hasSteps;
  }, [formData, ingredients, steps]);

  const handleCreate = () => {
    if (!isFormValid) return;
    onAddRecipe({
      ...formData,
      id: Date.now().toString(),
      author: 'Anda',
      rating: 5.0,
      reviews: [],
      duration: { hours: parseInt(formData.durationHours) || 0, minutes: parseInt(formData.durationMinutes) || 0 },
      ingredients,
      steps: steps.filter(s => s.trim() !== ''),
      calories: formData.calories ? parseInt(formData.calories) : 250,
      image: formData.image
    });
    onBack();
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white p-4 flex items-center gap-4 border-b border-slate-100 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
        <h1 className="text-xl font-bold">Tulis Resep</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-700 flex justify-between items-center">
            <span>Foto Masakan <span className="text-red-500">*</span></span>
            {formData.image && <span className="text-[10px] text-green-500 font-bold flex items-center gap-1"><CheckCircle size={10}/> Terunggah</span>}
          </p>
          <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed transition-colors flex flex-col items-center justify-center group cursor-pointer ${formData.image ? 'border-orange-500' : 'border-slate-200 bg-slate-50'}`}>
            {formData.image ? (
              <>
                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => setFormData({...formData, image: null})}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <Upload className="text-orange-500" size={24} />
                </div>
                <span className="text-xs text-slate-500 font-bold">Klik untuk upload foto</span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>
          {!formData.image && (
             <p className="text-[10px] text-slate-400 italic">Resep wajib memiliki foto agar menarik bagi pengguna lain.</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Judul Resep <span className="text-red-500">*</span></span>
            <input 
              type="text" 
              className="mt-1 w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-200 outline-none" 
              placeholder="Contoh: Pasta Carbonara"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Jenis Masakan <span className="text-red-500">*</span></span>
              <input 
                type="text" 
                className="mt-1 w-full p-4 bg-slate-50 border-none rounded-xl" 
                placeholder="Makan Siang"
                value={formData.cuisine}
                onChange={e => setFormData({...formData, cuisine: e.target.value})}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Estimasi Kalori (kcal)</span>
              <input 
                type="number" 
                className="mt-1 w-full p-4 bg-slate-50 border-none rounded-xl" 
                placeholder="250"
                value={formData.calories}
                onChange={e => setFormData({...formData, calories: e.target.value})}
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Durasi Memasak <span className="text-red-500">*</span></span>
            <div className="flex gap-4">
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl pr-4">
                <input 
                  type="number" 
                  min="0"
                  className="w-full p-4 bg-transparent border-none focus:ring-0 outline-none text-right" 
                  placeholder="0"
                  value={formData.durationHours || ''}
                  onChange={e => setFormData({...formData, durationHours: Math.max(0, parseInt(e.target.value) || 0)})}
                />
                <span className="text-slate-400 font-bold text-sm ml-2">Jam</span>
              </div>
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl pr-4">
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  className="w-full p-4 bg-transparent border-none focus:ring-0 outline-none text-right" 
                  placeholder="0"
                  value={formData.durationMinutes || ''}
                  onChange={e => setFormData({...formData, durationMinutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0))})}
                />
                <span className="text-slate-400 font-bold text-sm ml-2">Mnt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Bahan-bahan <span className="text-red-500">*</span></h3>
            <button onClick={addIngredient} className="text-orange-500 font-bold text-sm flex items-center gap-1"><Plus size={16}/> Tambah</button>
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
              <input 
                className="flex-[2] p-3 bg-slate-50 border-none rounded-lg text-sm" 
                placeholder="Nama bahan" 
                value={ing.name}
                onChange={e => {
                  const n = [...ingredients];
                  n[i].name = e.target.value;
                  setIngredients(n);
                }}
              />
              <div className="flex-1 relative">
                <input 
                  className={`w-full p-3 bg-slate-50 border-none rounded-lg text-sm transition-opacity ${ing.unit === 'secukupnya' ? 'opacity-30' : 'opacity-100'}`} 
                  placeholder="0"
                  type="number"
                  step="0.1"
                  min="0.1"
                  disabled={ing.unit === 'secukupnya'}
                  value={ing.unit === 'secukupnya' ? '' : ing.amount}
                  onChange={e => {
                    const n = [...ingredients];
                    n[i].amount = e.target.value;
                    setIngredients(n);
                  }}
                />
                {!ing.amount && ing.unit !== 'secukupnya' && (
                  <div className="absolute -top-1 -right-1">
                    <AlertCircle size={10} className="text-red-400" />
                  </div>
                )}
              </div>
              <select 
                className="flex-1 p-3 bg-slate-50 border-none rounded-lg text-sm appearance-none"
                value={ing.unit}
                onChange={e => {
                  const n = [...ingredients];
                  n[i].unit = e.target.value;
                  if (e.target.value === 'secukupnya') n[i].amount = '';
                  setIngredients(n);
                }}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {ingredients.length > 1 && (
                <button onClick={() => removeIngredient(i)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
              )}
            </div>
          ))}
          <p className="text-[10px] text-slate-400 italic font-medium">* Qty harus lebih dari 0 kecuali jika satuan "secukupnya"</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Cara Membuat <span className="text-red-500">*</span></h3>
            <button onClick={addStep} className="text-orange-500 font-bold text-sm flex items-center gap-1"><Plus size={16}/> Tambah</button>
          </div>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
              <span className="text-slate-400 font-bold pt-3">{i+1}</span>
              <div className="flex-1 relative">
                <textarea 
                  className="w-full p-3 bg-slate-50 border-none rounded-lg text-sm pr-10" 
                  placeholder="Deskripsikan langkah ini..." 
                  value={step}
                  onChange={e => {
                    const n = [...steps];
                    n[i] = e.target.value;
                    setSteps(n);
                  }}
                />
                {steps.length > 1 && (
                  <button onClick={() => removeStep(i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><X size={16} /></button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isFormValid && (
           <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-xs font-bold animate-pulse">
              <AlertCircle size={16} /> 
              <span>
                { !formData.image ? "Unggah foto masakan terlebih dahulu!" : "Mohon lengkapi semua bidang wajib (*)" }
              </span>
           </div>
        )}

        <Button full disabled={!isFormValid} onClick={handleCreate}>Publish Resep</Button>
      </div>
    </div>
  );
};

const ProfilePage = ({ recipes, onSelectRecipe }) => {
  const userRecipes = recipes.filter(r => r.author === 'Anda');

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <button className="p-2 bg-slate-100 rounded-full"><Settings size={20}/></button>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 border-4 border-white shadow-xl">
          <User size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Alex Johnson</h2>
          <p className="text-slate-500 text-sm">Pencinta masakan sehat</p>
        </div>
      </div>

      <div className="flex justify-center bg-slate-50 p-6 rounded-2xl">
        <div className="text-center">
          <p className="text-3xl font-black text-orange-600">{userRecipes.length}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">Resep Saya</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold flex items-center gap-2">
            <Grid size={18} className="text-orange-500" /> Galeri Resep
          </h3>
          <span className="text-xs font-bold text-slate-400">{userRecipes.length} Total</span>
        </div>
        
        {userRecipes.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
            <ChefHat size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Anda belum memposting resep apapun.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {userRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                onClick={() => onSelectRecipe(recipe)}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer group"
              >
                <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-[10px] font-bold truncate">{recipe.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-4">
        <button className="w-full flex justify-between items-center p-4 bg-slate-50 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-3"><Flame size={18} className="text-orange-500" /> Pengaturan Target Harian</div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
        <button className="w-full flex justify-between items-center p-4 bg-red-50 text-red-600 rounded-xl font-bold mt-4 hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-3"><LogOut size={18} /> Keluar</div>
        </button>
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [view, setView] = useState('home');
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [bookmarks, setBookmarks] = useState(['1']);
  const [intakeHistory, setIntakeHistory] = useState([
    { name: 'Breakfast Salad', calories: 220 },
    { name: 'Apel Merah', calories: 95 }
  ]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddReview = (recipeId, review) => {
    setRecipes(prev => prev.map(r => {
      if (r.id === recipeId) {
        const newReviews = [review, ...r.reviews];
        const newRating = (newReviews.reduce((acc, curr) => acc + curr.rating, 0) / newReviews.length).toFixed(1);
        return { ...r, reviews: newReviews, rating: parseFloat(newRating) };
      }
      return r;
    }));
  };

  const addIntake = (name, cal) => {
    setIntakeHistory(prev => [...prev, { name, calories: cal }]);
  };

  const bookmarkedRecipes = recipes.filter(r => bookmarks.includes(r.id));

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 relative overflow-hidden font-sans shadow-2xl">
      <div className="h-full overflow-y-auto bg-white">
        {view === 'home' && (
          <Feed 
            recipes={recipes} 
            onSelect={(r) => { setSelectedRecipe(r); setView('detail'); }} 
            bookmarks={bookmarks}
            onBookmark={toggleBookmark}
          />
        )}

        {view === 'track' && (
          <CalorieTracker 
            intakeHistory={intakeHistory} 
            onAddManual={addIntake} 
          />
        )}

        {view === 'bookmarks' && (
          <div className="p-4 space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-800">Resep Tersimpan</h1>
            {bookmarkedRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Bookmark size={48} className="mb-4 opacity-20" />
                <p>Belum ada resep tersimpan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarkedRecipes.map(recipe => (
                  <Card key={recipe.id} onClick={() => { setSelectedRecipe(recipe); setView('detail'); }} className="flex h-24">
                    <img src={recipe.image} className="w-24 h-full object-cover" alt={recipe.title} />
                    <div className="p-3 flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-slate-800 leading-tight text-sm">{recipe.title}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">{recipe.calories} kcal • {formatDuration(recipe.duration)}</p>
                    </div>
                    <div className="flex items-center pr-4">
                      <ChevronRight className="text-slate-300" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <CreateRecipe 
            onBack={() => setView('home')} 
            onAddRecipe={(r) => {
              setRecipes([r, ...recipes]);
              setView('home');
            }}
          />
        )}

        {view === 'profile' && (
          <ProfilePage 
            recipes={recipes} 
            onSelectRecipe={(r) => { setSelectedRecipe(r); setView('detail'); }} 
          />
        )}

        {view === 'detail' && selectedRecipe && (
          <RecipeDetail 
            recipe={recipes.find(r => r.id === selectedRecipe.id)} 
            onBack={() => setView('home')}
            onCook={addIntake}
            bookmarks={bookmarks}
            onBookmark={toggleBookmark}
            onAddReview={handleAddReview}
          />
        )}
      </div>

      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center p-4 px-6 z-40">
        <NavBtn active={view === 'home'} icon={<Home size={22} />} onClick={() => setView('home')} label="Home" />
        <NavBtn active={view === 'track'} icon={<Flame size={22} />} onClick={() => setView('track')} label="Track" />
        <button 
          onClick={() => setView('create')}
          className="w-14 h-14 -mt-10 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Plus size={28} />
        </button>
        <NavBtn active={view === 'bookmarks'} icon={<Bookmark size={22} />} onClick={() => setView('bookmarks')} label="Saves" />
        <NavBtn active={view === 'profile'} icon={<User size={22} />} onClick={() => setView('profile')} label="Profile" />
      </nav>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 1.5s ease-in-out infinite alternate;
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

function NavBtn({ active, icon, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-orange-500' : 'text-slate-400'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}