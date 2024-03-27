import Navigate from "./navigate/Navigate";
import BContent from "./content/BContent";
import './boards.css'

function Wrapper() {
  return (
    <div className="boards-container">
        <Navigate />
        <BContent />
    </div>
  )
};

export default Wrapper