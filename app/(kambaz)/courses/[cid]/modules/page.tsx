"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Form } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import {
  setModules,
  editModule,
  updateModule,
} from "./reducer";
import { RootState } from "../../../store";
import * as client from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector(
    (state: RootState) => state.modulesReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cid) return;
    void (async () => {
      const data = await client.findModulesForCourse(cid as string);
      dispatch(setModules(data));
    })();
  }, [cid, dispatch]);

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const created = await client.createModuleForCourse(
      cid as string,
      newModule
    );
    dispatch(setModules([...modules, created]));
    setModuleName("");
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(
      setModules(modules.filter((m: { _id: string }) => m._id !== moduleId))
    );
  };

  const onUpdateModule = async (module: Record<string, unknown>) => {
    await client.updateModule(module as { _id: string });
    dispatch(
      setModules(
        modules.map((m: { _id: string }) =>
          m._id === (module as { _id: string })._id ? module : m
        )
      )
    );
  };

  return (
    <div>
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => void onCreateModuleForCourse()}
      />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((module: Record<string, unknown> & { _id: string; name?: string; editing?: boolean; lessons?: unknown[] }) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <Form.Control
                  className="w-50 d-inline-block"
                  value={String(module.name ?? "")}
                  onChange={(e) =>
                    dispatch(
                      updateModule({ ...module, name: e.target.value })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = (e.target as HTMLInputElement).value;
                      void onUpdateModule({ ...module, name: v, editing: false });
                    }
                  }}
                />
              )}
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => void onRemoveModule(moduleId)}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {(module.lessons as { _id: string; name: string }[]).map((lesson) => (
                  <ListGroup.Item
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
