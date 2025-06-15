import Image from "next/image";

interface GetDirectionsProps {
  startPathMode: () => void;
}

export default function GetDirections({ startPathMode }: GetDirectionsProps) {
  return <>
    <div className="get-directions" onClick={startPathMode}>
      <Image
        src="/images/get_directions_icon.png"
        alt="Get Directions"
        width={100}
        height={100}
      />
      <label>길찾기</label>
    </div>
    <style jsx>{`
        .get-directions {
          position: absolute;
          bottom: 16px; right: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; flex-direction: column; gap: 4px;
          z-index: 1;
          align-items: center;
        }
        /* 모바일 환경에서 이미지 크기 조정 */
        @media (max-width: 600px) {
          .get-directions :global(img) {
            width: 75px !important;
            height: 75px !important;
          }
        }
      `}</style>
  </>
}