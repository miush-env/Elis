import { NavLink } from "react-router";

function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `shrink-0 flex flex-col items-center text-sm transition-colors ${
      isActive ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 pb-6 pt-3 flex justify-around items-center px-4 z-50">
      <NavLink to="/" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Alarma</span>
            <span
              className={`w-4 h-0.5 rounded-full mt-1.5 transition-all ${
                isActive ? "bg-white" : "bg-transparent"
              }`}
            />
          </>
        )}
      </NavLink>

      <NavLink to="/climate" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Clima</span>
            <span
              className={`w-4 h-0.5 rounded-full mt-1.5 transition-all ${
                isActive ? "bg-white" : "bg-transparent"
              }`}
            />
          </>
        )}
      </NavLink>

      <NavLink to="/stopwatch" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Cronómetro</span>
            <span
              className={`w-4 h-0.5 rounded-full mt-1.5 transition-all ${
                isActive ? "bg-white" : "bg-transparent"
              }`}
            />
          </>
        )}
      </NavLink>

      <NavLink to="/timer" className={linkClass}>
        {({ isActive }) => (
          <>
            <span>Temporizador</span>
            <span
              className={`w-4 h-0.5 rounded-full mt-1.5 transition-all ${
                isActive ? "bg-white" : "bg-transparent"
              }`}
            />
          </>
        )}
      </NavLink>
    </nav>
  );
}

export default NavBar;
