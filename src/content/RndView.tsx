import { Stack } from "@mui/material";
import useWindowSize from "react-use/lib/useWindowSize";
import { useState, useEffect } from "react";
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

  const [boxState, setBoxState] = useState<BoxState>(
    {
      width: defaultBoxWidth,
      height: defaultBoxHeight,
      x: windowWidth - defaultBoxWidth - marginXY,
      y: windowHeight - defaultBoxHeight - marginXY,
    }
  );
  //　初期位置
  useEffect(() => {
    setBoxState({ ...boxState, y: 150 });
  }, []);

  // ウィンドウサイズ変更時の位置調整
  useEffect(() => {
    let boxX = boxState.x;
    let boxY = boxState.y;
    if(boxState.x + boxState.width + marginXY > windowWidth){
      boxX = windowWidth - boxState.width - marginXY;
    }
    if(boxState.y + boxState.height + marginXY > windowHeight){
      boxY = windowHeight - boxState.height - marginXY;
    }
    setBoxState({ ...boxState, x: boxX, y: boxY });

  }, [windowWidth, windowHeight]);

  return (
    <Rnd
      size={{ width: boxState.width, height: boxState.height }}
      bounds="window"
      cancel=".no-drag-area"
      position={{ x: boxState.x, y: boxState.y }}
      style={{ backgroundColor: "lightcyan" }}
      onDragStop={(_: any, position: any) => {
        setBoxState({...boxState, x: position.x, y: position.y });
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
      <Stack direction="column" alignItems="center">
        {props.children}
      </Stack>


    </Rnd>
  );
}