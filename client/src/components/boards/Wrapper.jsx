import Navigate from "./navigate/Navigate";
import BContent from "./content/BContent";

function Wrapper() {
  return (
    <div className="relative flex flex-row">
        <Navigate />
        <BContent />
    </div>
  )
};

export default Wrapper