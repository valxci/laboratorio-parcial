import logo from "../assets/rappiLogo.png";
import { useNavigate } from 'react-router';

export default function Landing() {
    const navigate = useNavigate();
    const onSignUp = () => navigate('/role');
    const onLogin = () => navigate('/login');
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-satoshi">

            <nav className="navbar fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 lg:px-12 py-3">
                <div className="flex-1">
                    <img src={logo} alt="Rappi Logo" className="h-8 object-contain" />
                </div>

                <div className="flex-none gap-2 sm:gap-4">
                    <button onClick={onLogin} className="btn  rounded-full font-bold text-gray-700  px-6 border-2 border-gray-700 bg-gray-100 mr-2 hover:bg-gray-200">
                        Tengo cuenta
                    </button>

                    <button onClick={onSignUp} className="btn bg-[#FF441F] hover:bg-[#e63d1c] text-white rounded-full font-bold border-none shadow-md shadow-[#FF441F]/30 px-8">
                        Registrarse
                    </button>
                </div>
            </nav>


            <header className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 px-6 lg:px-12 w-full flex items-center justify-center min-h-[75vh]">
                {/* Contenedor grande redondeado con la imagen de fondo */}
                <div className="absolute inset-x-0 bottom-0 top-0 mt-20 mx-4 lg:mx-12 rounded-3xl overflow-hidden bg-gray-700 shadow-2xl">
                    {/* Placeholder para la imagen de fondo */}
                    <img
                        src="https://www.enter.co/wp-content/uploads/2024/05/como-ser-conductor-rappi.jpg"
                        alt="Food Delivery"
                        className="absolute inset-0 w-full h-full object-cover opacity-100 mix-blend-overlay"
                    />
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto mt-16 px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                        Lo que quieras, <br className="hidden md:block" />
                        <span className="text-[#FF441F]">a la puerta de tu casa</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-100 font-medium max-w-2xl mx-auto drop-shadow">
                        Pide en los mejores restaurantes, supermercados y farmacias de la ciudad. Entregas en minutos por nuestros repartidores expertos.
                    </p>
                    <div className="mt-10 flex justify-center">
                        <button onClick={onLogin} className="btn bg-[#FF441F] hover:bg-[#e63d1c] text-white border-none rounded-full px-10 py-4 h-auto text-lg font-bold shadow-xl shadow-[#FF441F]/40 transform hover:-translate-y-1 transition-transform cursor-pointer">
                            Ya tengo una cuenta
                        </button>
                    </div>
                </div>
            </header>

            
            <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">¿Por qué elegirnos?</h2>
                    <p className="text-gray-500 mt-4 text-lg font-medium">Hacemos tu vida más fácil con un ecosistema de primer nivel.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                    <div className="card bg-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="https://www.infobae.com/resizer/v2/GFBLYUU7ANERBP4BLRMRCZYBTE.jpg?auth=ba3e74411ee70c6569b8244613414f671fe700083f9399205aa164227e0b41f2&smart=true&width=350&height=197&quality=85" 
                            alt="Cliente" 
                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm" 
                        />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Deseas un rappi</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Pide lo que necesites en minutos. Explora cientos de restaurantes y supermercados locales con entregas ininterrumpidas directo a tu puerta.</p>
                    </div>

                    <div className="card bg-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="https://www.semana.com/resizer/v2/RQX7HNPVLJDSLGNKMOS2UPQOCM.jpg?smart=true&auth=4170b5a0b34d50b32f2cf366b048d14022d88c9dd0b212eae1c5ab41c13a3a0f&width=1280&height=720" 
                            alt="Tienda" 
                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm" 
                        />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Haz crecer tu Tienda</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Llega a miles de clientes nuevos cada día. Registra tu restaurante o comercio y aumenta exponencialmente tus ventas diarias.</p>
                    </div>

                    <div className="card bg-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="https://thelogisticsworld.com/wp-content/uploads/2021/04/rappi-repartidores.jpg" 
                            alt="Repartidor" 
                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm" 
                        />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Conduce con nosotros</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Gana dinero con un horario flexible. Sé tu propio jefe, conéctate cuando quieras y genera ingresos realizando entregas locales.</p>
                    </div>
                </div>
            </section>


            <section className="py-12 px-6 lg:px-12 max-w-6xl mx-auto mb-20">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 flex flex-col md:flex-row overflow-hidden items-center p-6 md:p-10 gap-10">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="https://thelogisticsworld.com/wp-content/uploads/2020/10/RappiEntrega.jpeg" 
                            className="w-full h-64 md:h-[350px] object-cover rounded-3xl shadow-md" 
                            alt="Vender en la app" 
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">¿Quieres vender <br/> con nosotros?</h2>
                        <p className="text-gray-500 leading-relaxed font-medium text-lg mb-8">Únete a miles de restaurantes y tiendas aliadas. Regístrate como una sucursal y accede a millones de clientes listos para pedir en toda la ciudad.</p>
                        <button onClick={onSignUp} className="btn bg-[#FF441F] hover:bg-[#e63d1c] text-white rounded-full font-bold border-none shadow-md shadow-[#FF441F]/30 px-10 py-3 w-fit text-lg cursor-pointer transition-transform hover:-translate-y-1">
                            Unirme ahora
                        </button>
                    </div>
                </div>
            </section>


            <footer>
                <div className="bg-[#FF441F] w-full h-20 mt-12">
                </div>
            </footer>


        </div>
    );
}
