import HeaderV2 from "../components/header-v2/HeaderV2";
import Wrapper from "../components/boards/Wrapper";
import '../components/boards/boards.css'

function Boards() {
  return (
    <>
    <HeaderV2 />
    <main id="boards-wrapper">
        <Wrapper />
    </main>
    </>
  )
};

export default Boards