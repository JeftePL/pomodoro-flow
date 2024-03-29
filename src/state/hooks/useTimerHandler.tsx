import { useEffect, useCallback, useRef } from "react";
import { useRecoilState } from "recoil";
import { watchState } from "@state/atom";
import { ITask } from "@interfaces/ITask";
import { IWatch } from "@interfaces/IWatch";
import { formatStringToSeconds } from "@common/utils/timeFormatter";
import useFlowHandler from "./useFlowHandler";
import useGetSelectedTask from "./useGetSelectedTask";
import useToggleCompleteTask from "./useToggleCompleteTask";

export default function useTimerHandler() {
  const [watch, setWatch] = useRecoilState<IWatch>(watchState);
  const isTimerRunningRef = useRef<boolean>(false);
  const timerIdRef = useRef<number | undefined>(undefined);

  const selectedTask: ITask | null = useGetSelectedTask();

  const toggleCompleteTask = useToggleCompleteTask();
  const flowHandler = useFlowHandler();

  const stopTimer = useCallback(() => {
    clearInterval(timerIdRef.current);
    timerIdRef.current = undefined;
    isTimerRunningRef.current = false;
  }, []);

  const startTimer = useCallback(() => {
    if (selectedTask?.completed || isTimerRunningRef.current) {
      return;
    }
    isTimerRunningRef.current = true;
    let timeWatch = watch.value;
    timerIdRef.current = setInterval(() => {
      try {
        if (selectedTask) {
          const timePassedInSeconds = watch.initialValue - watch.value;
          const remainingTimeInSeconds = formatStringToSeconds(selectedTask.remainingTime);
          if (remainingTimeInSeconds - timePassedInSeconds === 0) {
            toggleCompleteTask(selectedTask.id);
            setWatch(oldWatch => ({ ...oldWatch, value: 0, run: false }));
            stopTimer();
            return;
          }
        }
        if (timeWatch === 0) {
          flowHandler();
        } else {
          setWatch(oldWatch => ({ ...oldWatch, value: timeWatch - 1 }));
          timeWatch -= 1;
        }
      } catch (error) {
        console.error("Timer Error:", error);
        stopTimer();
      }
    }, 1000);
  }, [toggleCompleteTask, setWatch, selectedTask, watch, stopTimer, flowHandler]);

  useEffect(() => {
    if (watch.run && !isTimerRunningRef.current) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [watch.run, startTimer, stopTimer]);

  return () => {
    if (selectedTask?.completed) {
      return;
    }
    flowHandler();
  };
}
