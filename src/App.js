import * as React from "react";

import './App.css';
import Header from './components/Header';
import CajaTexto from './components/CajaTexto';
import Mensajes from './components/Mensajes';
import Progreso from "./components/Progreso";
import AudioRecorder from './components/AudioRecorder';

import {NextUIProvider, ScrollShadow } from "@nextui-org/react";
import { ConversationProvider } from "./context/context";

function App() {
  return (
    <ConversationProvider>
      <NextUIProvider>
        <main className="flex flex-col h-screen">
          <Header />
          
          <section className="flex flex-row flex-1 overflow-auto p-4">
            <Progreso className="w-1/4" />
            <ScrollShadow hideScrollBar size={100} className="flex-1">
              <Mensajes />
            </ScrollShadow>
          </section>

          <section className="flex flex-row">
            <CajaTexto />
            <AudioRecorder />
          </section>
        </main>
      </NextUIProvider>
    </ConversationProvider>
  );
}

export default App;
