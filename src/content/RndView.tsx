import { Stack } from "@mui/material";
import useWindowSize from "react-use/lib/useWindowSize";
import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

type Props = {
  children: React.ReactNode;
}

type BoxState = {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function RndView(props: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const defaultBoxWidth = 500;
  const defaultBoxHeight = 400;
  const marginXY = 20;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [boxState, setBoxState] = useState<BoxState>(
    {
      width: defaultBoxWidth,
      height: defaultBoxHeight,
      x: windowWidth - defaultBoxWidth - marginXY,
      y: windowHeight - defaultBoxHeight - marginXY,
    }
  );

  // 子要素サイズに合わせて自動リサイズ
  useEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }

    const resizeToContent = () => {
      const measuredHeight = Math.round(node.getBoundingClientRect().height);

      let newY = boxState.y;
      if(boxState.y + measuredHeight + marginXY > windowHeight){
        newY = windowHeight - measuredHeight - marginXY;
      }

      setBoxState({
        ...boxState,
        height: measuredHeight,
        y: newY
      });
    };

    resizeToContent();

    const observer = new ResizeObserver(() => {
      resizeToContent();
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ウィンドウサイズ変更時の位置調整
  useEffect(() => {
    setBoxState((prev) => {
      let boxX = prev.x;
      let boxY = prev.y;
      if (prev.x + prev.width + marginXY > windowWidth) {
        boxX = windowWidth - prev.width - marginXY;
      }
      if (prev.y + prev.height + marginXY > windowHeight) {
        boxY = windowHeight - prev.height - marginXY;
      }

      return { ...prev, x: boxX, y: boxY };
    });

  }, [windowWidth, windowHeight]);

  return (
    <Rnd
      size={{ width: boxState.width, height: boxState.height }}
      bounds="window"
      cancel=".no-drag-area"
      position={{ x: boxState.x, y: boxState.y }}
      style={{ backgroundColor: "lightcyan" }}
      onDragStop={(_: any, position: any) => {
        setBoxState((prev) => ({ ...prev, x: position.x, y: position.y }));
      }}
      onResize={(_, __, ref, ___, position) => {
        setBoxState({
          x: position.x,
          y: position.y,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10)
        });
      }

      }
    >
      <Stack ref={contentRef} direction="column" alignItems="center">
        {props.children}
      </Stack>


    </Rnd>
  );
}