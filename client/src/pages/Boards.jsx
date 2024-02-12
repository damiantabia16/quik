import HeaderV2 from "../components/header-v2/HeaderV2";
import Wrapper from "../components/boards/Wrapper";

function Boards() {
  return (
    <>
    <HeaderV2 />
    <main className="relative flex flex-col mt-[70px]">
        <Wrapper />
    </main>
    </>
  )
};

export default Boards