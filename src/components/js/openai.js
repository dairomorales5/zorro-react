import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});


export const audioTranscription = async (audio_blob) => {
  // Convert the audio blob to a Buffer
  const audioBuffer = await audio_blob.arrayBuffer();
  const audioArray = new Uint8Array(audioBuffer);

  // Create a file object with the audio data
  const audioFile = new File([audioArray], 'audio.wav', { type: 'audio/wav' });

  try {
    // Make the transcription request
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      prompt: "El nombre de nuestra empresa es ZoRRO, así que va a ser una palabra común en los audios.",
      language: 'es'
    });
    return transcription;
  } catch (error) {
    console.error('Error en la transcripción:', error);
    throw error;
  }
};

export const ContextGeneration = (mensajes,tipo) =>{
  if(tipo==='json'){
    return [{role:"system", content: 'Genera un archivo JSON basado en la conversación del usuario y ZoRRO. El json tiene la siguiente estructura: {aprueba: bool, actitud: str, metodos_calificacion: str, aspectos_mejorar: str, opinion_universidad: str}. NO inventes cosas, la conversación será paulatina, así que es normal tener muchas llaves vacías. Es más, si un tema solo se subre superficialmente, no llenes esa información. Queremos que la conversación nos de información profunda.'},
    ...mensajes.slice(1,-1).map((msj) => ({role: msj.usuario === process.env.REACT_APP_ASSISTANT_NAME ? 'assistant' : 'user',content: msj.mensaje}))]
  } else {
    return [{role:"system", content: `Te llamas ZoRRO. Eres un experto en obtener percepciones de estudiantes.
    Al estudiante le vas a preguntar sobre su percepción acerca del profesor ${mensajes.profesor} en la materia ${mensajes.materia}.
    Debes preguntarle sobre actitud, métodos de calificación, qué puede mejorar, y qué piensa de la universidad en general.
    Si el estudiante ya terminó de responder todo eso, o ya no quiere seguir respondeindo más, despídete de forma amigable.
    Pregunta una cosa a la vez. Con cada respuesta que te dé el estudiante, debes responder de una manera muy empática (usas emojis y memes para responder) y luego de alguna manera seguir con las demás preguntas.
    El siguiente es un JSON con la información parcial que ha contestado el estudiante. Pregunta por lo que falta. Si no hace falta nada más, pregunta por si tiene comentarios adicionales y despídete.
    ${JSON.stringify(mensajes.json)}.`},
    {role: "user", content: mensajes.mensaje.mensaje}]
  }
}

export const jsonGeneration = async (mensajes) => {
  const completion = await openai.chat.completions.create({
    messages: ContextGeneration(mensajes,'json'),
    model: "gpt-3.5-turbo-1106",
    response_format: { "type": "json_object" }
  });
  return completion;
}

const fetchOpenAIStream = async (mensajes, json, profesor, materia) => {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: ContextGeneration({ json: json, mensaje: mensajes[mensajes.length - 2], profesor: profesor, materia: materia }, 'conversation'),
    stream: true,
  });

  let generacion = '';

  for await (const chunk of stream) {
    const newContent = chunk.choices[0]?.delta?.content || '';
    generacion += newContent;
  }

  return generacion;
};

export const conversationUpdate = (agregarMensaje,text,setMensajes,createSystemMessage,json,setJson,profesor,materia) => {
  agregarMensaje(text);
  setMensajes((prevMensajes) => {
    console.warn('Cambiando mensajes');
    let nuevos_mensajes = [...prevMensajes, createSystemMessage('')];
    jsonGeneration(nuevos_mensajes).then((res) => {
      let json_OA = res.choices[0].message.content;
      console.log(json_OA);
      setJson( JSON.parse(json_OA) );
    });
    fetchOpenAIStream(nuevos_mensajes, json, profesor, materia).then((res) => {
      agregarMensaje(res);
    });
    return nuevos_mensajes;
  });
}