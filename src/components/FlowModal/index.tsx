import { useState } from "react";
import  "./FlowModal.scss";
import Button from "@components/Button";
import useFlow from "@state/hooks/useFlow";
import { formatStringToSeconds } from "@common/utils/timeFormatter";
import useEditFlow from "@state/hooks/useEditFlow";
import { IFlow } from "@interfaces/IFlow";
import TimerRangeInput from "./TimerRangeInput";

export default function FlowModal() {
  const flow: IFlow = useFlow();
  const editFlow = useEditFlow();

  const initialPomodoro = formatStringToSeconds(flow.pomodoro.time);
  const initialShortBreak = formatStringToSeconds(flow.shortBreak.time);
  const initialLongBreak = formatStringToSeconds(flow.longBreak.time);

  const [pomodoro, setPomodoro] = useState(initialPomodoro.toString());
  const [shortBreak, setShortBreak] = useState(initialShortBreak.toString());
  const [longBreak, setLongBreak] = useState(initialLongBreak.toString());

  const handleEditFlow = () => {
    editFlow(pomodoro, shortBreak, longBreak);
  };

  return (
    <div className="flowModal">
      <div className="flowModal__container">
        <TimerRangeInput
          label="pomodoro"
          identifier="Pomodoro"
          value={pomodoro}
          onChange={setPomodoro}
        />
        <TimerRangeInput
          label="Short Break"
          identifier="shortBreak"
          value={shortBreak}
          onChange={setShortBreak}
        />
        <TimerRangeInput
          label="Long Break"
          identifier="longBreak"
          value={longBreak}
          onChange={setLongBreak}
        />
      </div>
      <Button onClick={handleEditFlow}>Ok</Button>
    </div>
  );
}
