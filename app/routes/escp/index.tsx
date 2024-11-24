import video from "../../../public/videos/home.mp4";
import videoPoster from "../../../public/images/video-poster.png";
import Wrapper from "~/components/Wrapper/Wrapper";

export default function Escp() {
  return (
    <Wrapper activePage="escp" isEquallyDistributed hasBookingAction>
      <div className="relative flex flex-col text-center md:mx-auto">
        <video
          className="h-[70vh] object-cover opacity-90 contrast-[0.9] md:h-[calc(100vh-4rem)]"
          src={video}
          id="video"
          autoPlay
          loop
          muted
          poster={videoPoster}
        ></video>

        <p className="text-wrap absolute bottom-3 flex w-full justify-end pr-3 font-head text-2xl font-bold uppercase text-white">
          Kyiv based photo studio
        </p>
      </div>
    </Wrapper>
  );
}
