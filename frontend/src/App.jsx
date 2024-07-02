import { useState, useEffect } from "react";
import "./App.css";
import { langs } from "./languages/languages";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { IoMicOutline } from "react-icons/io5";
import { MdOutlinePauseCircle } from "react-icons/md";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

function App() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const { transcript, listening } = useSpeechRecognition();
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const voices = window.speechSynthesis.getVoices();

  const handleChangeSourceLang = (e) => {
    setSourceLang(e.target.value);
  };

  const handleChangeTargetLang = (e) => {
    setTargetLang(e.target.value);
  };

  const translateText = async () => {
    if (text !== "") {
      const response = await axios.post("http://localhost:5600/translate", {
        text,
        targetLang,
        sourceLang,
      });
      setTranslatedText(response.data);
    }
  };

  const handleSpeech = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const handleSpeak = () => {
    if (speaking) {
      cancel();
    } else {
      speak({ text: translatedText, voice });
    }
  };

  useEffect(() => {
    if (!transcript) return;
    setText(transcript);
  }, [transcript]);

  useEffect(() => {
    let voice = {};
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].lang.includes(targetLang)) {
        voice = voices[i];
      }
    }
    if (voice.lang) {
      setVoice(voice);
    }
  }, [voices, targetLang]);

  return (
    <>
      <div className="w-fit m-auto font-[montserrat]">
        <div className="flex justify-center gap-80 my-4">
          <div className="flex justify-center pt-44 gap-2">
            <select
              className="block w-full mt-1 p-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              value={sourceLang}
              onChange={handleChangeSourceLang}
            >
              {langs.map((ele) => (
                <option key={ele.code} value={ele.code}>
                  {ele.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center pt-44 gap-2">
            <select
              className="block w-full mt-1 p-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              value={targetLang}
              onChange={handleChangeTargetLang}
            >
              {langs.map((ele) => (
                <option key={ele.code} className="  p-1" value={ele.code}>
                  {ele.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <div className="border rounded-md h-64 w-[50rem] py-3 pr-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-44 pt-3 px-3 focus:outline-none text-xl resize-none"
            ></textarea>
            <button className="my-6 px-2" onClick={handleSpeech}>
              {listening ? (
                <MdOutlinePauseCircle size={30} className="text-blue-400" />
              ) : (
                <IoMicOutline size={30} className="text-blue-400" />
              )}
            </button>
          </div>
          <div className="border rounded-md h-64 w-[50rem] pt-3 pl-3 pr-1">
            <div className="w-full h-48 overflow-y-auto scroll-m-8 pr-3 py-3">
              <p>{translatedText}</p>
            </div>
            <button className=" fixed mt-4" onClick={handleSpeak}>
              {speaking ? (
                <MdOutlinePauseCircle size={30} className="text-blue-400" />
              ) : (
                <HiOutlineSpeakerWave size={30} className="text-blue-400 " />
              )}
            </button>
          </div>
        </div>
        <div>
          <button
            className="bg-blue-600 px-3 py-1 rounded-lg text-white my-3 font-semibold"
            onClick={translateText}
          >
            Translate
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
