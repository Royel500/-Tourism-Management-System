import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  // start from saved value or light
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
      className="flex btn btn-sm rounded-full text-white  bg-black "
      title="Toggle Dark/Light Mode"
    >
      {theme === 'light' ? <FaMoon size={20}/> : <FaSun size={20}/>}
      {/* Or icons: {theme === 'light' ? <FaMoon /> : <FaSun />} */}
    </button>
  );
};

export default ThemeToggle;
