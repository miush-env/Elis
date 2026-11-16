import { NavLink } from "react-router";
import NavBar from "@/components/NavBar";

function TestPage() {
  return (
    <div>
      <h1>Esto es la pagina de crear alarma</h1>
      <button className="bg-blue-500 py-2 px-5">
        <NavLink to="/">Inicio</NavLink>
      </button>

      <NavBar />
    </div>
  )
}

export default TestPage