"use client";

import { Suspense } from "react";
import Link from "next/link";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import EncodingStateInUrl from "./EncodingStateInUrl";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }

  return (
    <div id="wd-lab4" className="container">
      <h2>Lab 4</h2>
      <ClickEvent />
      <PassingDataOnEvent />
      <div id="wd-passing-functions">
        <PassingFunctions theFunction={sayHello} />
      </div>
      <EventObject />
      <Suspense fallback={<div>Loading...</div>}>
        <EncodingStateInUrl />
      </Suspense>
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <DateStateVariable />
      <ObjectStateVariable />
      <ArrayStateVariable />
      <ParentStateComponent />
      <hr />
      <Link href="/labs/lab4/redux">Redux Examples</Link>
      <hr />
      <Link href="/labs/lab4/react-context">React Context Examples</Link>
      <hr />
      <Link href="/labs/lab4/zustand">Zustand Examples</Link>
    </div>
  );
}
