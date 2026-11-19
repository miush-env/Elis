import { NavLink } from "react-router";

function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `shrink-0 whitespace-nowrap flex flex-col items-center text-md ${
      isActive ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
    }`;

  return (
   <nav className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 pb-6 pt-3 flex overflow-x-auto gap-5 px-6 no-scrollbar">
      <NavLink to="/" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Alarma</span>
            {isActive ? (
              <span className="w-5 h-0.5 bg-white rounded-full mt-1" />
            ) : (<span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />)}
          </>
        )}
      </NavLink>

      <NavLink to="/world-clock" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Reloj Mundial</span>
            {isActive ? (
              <span className="w-5 h-0.5 bg-white rounded-full mt-1" />
            ) : (<span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />)}
          </>
        )}
      </NavLink>

      <NavLink to="/stopwach" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Cronómetro</span>
            {isActive ? (
              <span className="w-5 h-0.5 bg-white rounded-full mt-1" />
            ) : (<span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />)}
          </>
        )}
      </NavLink>

      <NavLink to="/timer" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Temporizador</span>
            {isActive ? (
              <span className="w-5 h-0.5 bg-white rounded-full mt-1" />
            ) : (<span className="w-5 h-0.5 bg-transparent rounded-full mt-1" />)}
          </>
        )}
      </NavLink>
    </nav>
  );
}

export default NavBar;
