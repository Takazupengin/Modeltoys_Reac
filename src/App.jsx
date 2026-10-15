<<<<<<< HEAD
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
=======
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Especial from './pages/Especial';
import Nosotros from './pages/Nosotros';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import ProductCard from './components/ProductCard';
import { productosCatalog } from './data/productos';

function App() {
  // 1. Estado para navegación entre pantallas
  const [vistaActual, setVistaActual] = useState('inicio');
  const [escalasSeleccionadas, setEscalasSeleccionadas] = useState([]);
  const [soloEnStock, setSoloEnStock] = useState(true);

  // 2. Catálogo dinámico: Si en el navegador hay una versión vieja con menos productos, toma los 16 nuevos
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem('productos_db');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length >= productosCatalog.length) {
          return parsed;
        }
      }
      return productosCatalog;
    } catch {
      return productosCatalog;
    }
  });

  // 3. Estado de sesión del usuario logueado
  const [usuarioActual, setUsuarioActual] = useState(() => {
    try {
      const u = localStorage.getItem('usuario_sesion');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // 4. Lista de usuarios registrados (Pilotos)
  const [usuarios, setUsuarios] = useState(() => {
    try {
      const u = localStorage.getItem('usuarios_db');
      return u ? JSON.parse(u) : [
        { nombre: 'Erik Carrasco', correo: 'erik@modeltoys.cl', password: '123456', rol: 'piloto' }
      ];
    } catch {
      return [];
    }
  });

  // 5. Historial global de compras realizadas
  const [ordenes, setOrdenes] = useState(() => {
    try {
      const o = localStorage.getItem('ordenes_db');
      return o ? JSON.parse(o) : [];
    } catch {
      return [];
    }
  });

  // 6. Foro de consultas de hangar
  const [foros, setForos] = useState(() => {
    try {
      const f = localStorage.getItem('foros_db');
      return f ? JSON.parse(f) : [
        { id: 'post-1', autor: 'Amuro Ray', kit: 'RG RX-78-2 2.0', pregunta: '¿Qué número de lija recomiendan para pulir los nubs del inner frame sin rayar?', fecha: '12/10/2026' },
        { id: 'post-2', autor: 'Char Aznable', kit: 'Tamiya Panel Line', pregunta: '¿Es necesario aplicar barniz brillante antes de aplicar el panel line negro en piezas rojas?', fecha: '11/10/2026' }
      ];
    } catch {
      return [];
    }
  });

  // 7. Estado único central del Carrito de Compras
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Sincronizaciones automáticas en localStorage
  useEffect(() => {
    localStorage.setItem('productos_db', JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('ordenes_db', JSON.stringify(ordenes));
  }, [ordenes]);

  useEffect(() => {
    localStorage.setItem('foros_db', JSON.stringify(foros));
  }, [foros]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('usuario_sesion', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('usuario_sesion');
    }
  }, [usuarioActual]);

  // Funciones de gestión de usuarios y sesión
  const registrarUsuario = (nuevo) => {
    setUsuarios((prev) => [...prev, nuevo]);
  };

  const handleEliminarUsuario = (correoAEliminar) => {
    setUsuarios((prev) => prev.filter((u) => u.correo !== correoAEliminar));
  };

  const handleLoginSuccess = (user) => {
    setUsuarioActual(user);
    if (user.rol === 'admin') {
      setVistaActual('admin');
    } else {
      setVistaActual('perfil');
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    setVistaActual('inicio');
  };

  // Funciones de gestión de productos desde Admin
  const handleActualizarProducto = (productoId, cambios) => {
    setProductos((prev) =>
      prev.map((item) => (item.id === productoId ? { ...item, ...cambios } : item))
    );
  };

  // Guardado de órdenes y foro
  const agregarOrdenCompra = (nuevaOrden) => {
    setOrdenes((prev) => [nuevaOrden, ...prev]);
  };

  const agregarPostForo = (nuevoPost) => {
    setForos((prev) => [nuevoPost, ...prev]);
  };

  // Filtros de barra lateral
  const handleCheckboxChange = (escala) => {
    setEscalasSeleccionadas((prev) =>
      prev.includes(escala) ? prev.filter((item) => item !== escala) : [...prev, escala]
    );
  };

  // Carrito: agregar producto
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id);
      if (existe) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prevCarrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagenes ? producto.imagenes[0] : producto.imagen,
          cantidad: 1,
          grade: producto.grade
        }
      ];
    });
  };

  const totalItemsCarrito = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);

  // Filtrado reactivo de productos del catálogo editable
  const productosFiltrados = productos.filter((item) => {
    if (escalasSeleccionadas.length === 0) return true;
    return escalasSeleccionadas.includes(item.scale);
  });

  return (
    <div 
      className="text-light min-vh-100 d-flex flex-column" 
      style={{ backgroundColor: '#05070c' }}
    >
      {/* Header con contador dinámico, sesión de piloto y navegación */}
      <Header 
        cartCount={totalItemsCarrito}
        onNavigate={setVistaActual}
        vistaActual={vistaActual}
        usuarioLogueado={usuarioActual}
      />

      {/* VISTA 1: INICIO */}
      {vistaActual === 'inicio' && (
        <Inicio 
          onNavigate={setVistaActual} 
          onSelectCategory={(cat) => {
            if (cat === 'all') setEscalasSeleccionadas([]);
            else setEscalasSeleccionadas([cat]);
          }} 
        />
      )}

      {/* VISTA 2: CATÁLOGO RESPONSIVO (16 PRODUCTOS) */}
      {vistaActual === 'catalogo' && (
        <main className="container-fluid my-4 flex-grow-1" style={{ maxWidth: '1440px', padding: '0 20px' }}>
          <div className="mb-4 pb-2" style={{ borderBottom: '2px solid #00d2ff' }}>
            <h2 className="fw-bold m-0" style={{ color: '#ffffff', fontSize: '1.6rem' }}>
              Catálogo de Model Kits & Accesorios
            </h2>
          </div>

          <div className="catalog-container-responsive">
            {/* Columna Izquierda: Filtros estilo Mecha */}
            <aside className="sidebar-filters-wrapper">
              <div className="sidebar-filters">
                <h3>SHOPPING OPTIONS</h3>
                
                <div className="filter-group">
                  <h4>GRADE / SCALE</h4>
                  {[
                    { id: 'HG', label: 'HG (High Grade 1/144)' },
                    { id: 'RG', label: 'RG (Real Grade 1/144)' },
                    { id: '1/100', label: '1/100 (MG)' },
                    { id: '1/60', label: '1/60 (PG)' },
                    { id: 'tools', label: 'Herramientas' }
                  ].map((filtro) => (
                    <label key={filtro.id}>
                      <input 
                        type="checkbox"
                        checked={escalasSeleccionadas.includes(filtro.id)}
                        onChange={() => handleCheckboxChange(filtro.id)}
                      />
                      {filtro.label}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>AVAILABILITY</h4>
                  <label>
                    <input 
                      type="checkbox"
                      checked={soloEnStock}
                      onChange={(e) => setSoloEnStock(e.target.checked)}
                    />
                    In Stock
                  </label>
                </div>

                <button 
                  type="button" 
                  className="btn-apply-filters"
                  onClick={() => setEscalasSeleccionadas([])}
                >
                  {escalasSeleccionadas.length > 0 ? 'LIMPIAR FILTROS' : 'APLICAR FILTROS'}
                </button>
              </div>
            </aside>

            {/* Columna Derecha: Grilla de Productos adaptable a resolución y zoom */}
            <section className="catalog-products-wrapper">
              <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                {productosFiltrados.map((item) => (
                  <div key={item.id} className="col">
                    <ProductCard item={item} onAddToCart={agregarAlCarrito} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {/* VISTA 3: CARRITO */}
      {vistaActual === 'carrito' && (
        <Carrito 
          items={carrito} 
          onUpdateCart={setCarrito} 
          onNavigate={setVistaActual}
          usuarioLogueado={usuarioActual}
          onGuardarOrden={agregarOrdenCompra}
        />
      )}

      {/* VISTA 4: LOGIN / REGISTRO */}
      {vistaActual === 'login' && (
        <Login 
          usuarios={usuarios}
          onRegistroUsuario={registrarUsuario}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={setVistaActual}
        />
      )}

      {/* VISTA 5: PERFIL DE PILOTO (HISTORIAL Y FORO) */}
      {vistaActual === 'perfil' && usuarioActual && (
        <Perfil 
          usuario={usuarioActual}
          ordenes={ordenes}
          foros={foros}
          onAgregarPost={agregarPostForo}
          onCerrarSesion={cerrarSesion}
          onNavigate={setVistaActual}
        />
      )}

      {/* VISTA 6: ADMIN (CONTROL CENTRAL & PLANILLA EXCEL) */}
      {vistaActual === 'admin' && (
        <Admin 
          usuarios={usuarios}
          ordenes={ordenes}
          productos={productos}
          onEliminarUsuario={handleEliminarUsuario}
          onActualizarProducto={handleActualizarProducto}
          onCerrarSesion={cerrarSesion}
          onNavigate={setVistaActual}
        />
      )}

      {/* VISTA 7: ESPECIAL / PREVENTAS P-BANDAI */}
      {(vistaActual === 'especial' || vistaActual === 'special') && (
        <Especial onNavigate={setVistaActual} onAddToCart={agregarAlCarrito} />
      )}
      
      {/* VISTA 8: NOSOTROS */}
      {vistaActual === 'nosotros' && (
        <Nosotros onNavigate={setVistaActual} />
      )}

      {/* Footer corporativo */}
      <footer className="border-top border-secondary py-3 text-center text-muted small mt-auto" style={{ backgroundColor: '#070c12' }}>
        <div className="container">
          <p className="m-0">© 2026 ModelToys - Tienda de Model Kits y Coleccionables. Viña del Mar, Chile.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
>>>>>>> feature/avance-1
