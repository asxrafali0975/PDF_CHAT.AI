import axios from 'axios'
import React, { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import NavBar from './NavBar'
import port from '../../Configs/config'



function Home() {

  const [fileNames, setFileNames] = useState(["No PDF'S Selected"])
  const [status, setStatus] = useState("Waiting for pdfs...")
  const [question, setQuestion] = useState("")
  const [chats, SetChats] = useState([  //dummy chats at starting
    {
      type: "user",
      message: "What is this PDF about?..."
    },
    {
      type: "bot",
      message: "This PDF discusses about ..."
    },

  ])


  // for uploading multiple pdfs to backend  
  const UploadPdfs = (e) => {
    const files = e.target.files
    const formData = new FormData();

    //appending all pdf's in formData
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
      setFileNames((old) => [...old, files[i].name])

    }
    setStatus("Uploading pdfs...")

    //sending all pdf's to backend 
    axios.post(`${port}/upload`, formData, { withCredentials: true })
      .then((resp) => {
        setStatus(resp.data.success)
      })
      .catch((err) => {

        if (err.response) {

          setStatus(err.response.data.detail)
        }

        else {
          console.log(
            "Server unreachable"
          );
        }

      })

  }


  const uploadQuestion = () => {

    if (!question.trim()) return;

    //saving all old chats and appending new chat or user and rendering it
    SetChats((old) => [
      ...old,
      { type: "user", message: question }
    ]);

    //sending question to backend

    axios.post(
      `${port}/quesUpload`,
      { data: question },
      { withCredentials: true }
    )
      .then((resp) => {
        //after recieving output appending answer in chats as "BOT"
        SetChats((old) => [
          ...old,
          { type: "bot", message: resp.data.data }
        ]);
      })
      .catch((err) => {

        if (err.response) {

          setStatus(err.response.data.detail)
        }

        else {
          console.log(
            "Server unreachable"
          );
        }

      })


    // To clear input field after sending question
    setQuestion("");
  }



  return (

    <div className='h-screen w-full flex flex-col p-2'>

      <NavBar />

      <div
        id="pdfUpload"
        className="w-full h-[40%] self-center border-[2px]  border-black rounded-md flex items-center justify-center p-4  sm:w-[90%] lg:w-[70%]  "
      >
        <div className="w-full max-w-md flex   flex-col items-center sm:w-[50%] ">

          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            multiple
            className="hidden h-[90%] sm:w-[90%] self-center"
            onChange={UploadPdfs}
          />

          <label
            htmlFor="pdf-upload"
            className="border-2 flex items-center justify-center h-[50px] w-full max-w-[300px] sm:w-[90%] lg:text-2xl"
          >
            <i className="ri-upload-cloud-fill"></i>
            Upload PDF Here
          </label>

          <div className="w-full mt-4 text-center break-words">
            {fileNames.map((v, index) => (
              index != 0 ? <h1 key={index}>{v}</h1> : ""
            ))}
            {/* waiting for pdfs , uploading , uploaded , ask questions  */}
            <h1 className='text-blue-700 fond-semibold lg:text-2xl '>{status}</h1>

          </div>

        </div>
      </div>


      <div id='askquestions' className='self-center flex flex-col    min-h-[50%]  justify-between rounded-md mt-2 w-full h-auto lg:w-[70%]  '>

        {
          chats.map((val, index) => {
            //each val object will have 2 things type (user or bot) and message
            if (chats.length > 2 && index > 1) {
              return val.type == "bot" ? <h1 key={index} className=' mt-2 mb-2 bg-blue-600 text-white self-start border-[1.5px] border-black w-[80%] h-auto flex items-center justify-start p-3 rounded-md  sm:w-[60%] sm:min-h-[20%] '>{val.message}</h1> : <h1 key={index} className='mt-2 mb-2 bg-white text-black self-end w-[50%]  border-[1.5px] border-black h-auto flex items-center justify-start p-3 rounded-md sm:w-[60%] sm:min-h-[20%]' >{val.message}</h1>
            }
            else if (chats.length == 2 && index <= 1) {
              return val.type == "bot" ? <h1 key={index} className=' mt-2 mb-2 bg-blue-600 text-white self-start border-[1.5px] border-black w-[80%] h-auto flex items-center justify-start p-3 rounded-md sm:w-[60%] sm:min-h-[20%] '>{val.message}</h1> : <h1 key={index} className=' mt-2 mb-2 bg-white text-black self-end w-[50%]  border-[1.5px] border-black h-auto flex items-center justify-start p-3 rounded-md sm:w-[60%] sm:min-h-[20%] ' >{val.message}</h1>

            }


          })
        }

        <div className="border-t p-2 flex gap-2 ">
          <input
            type="text"
            value={question}
            placeholder="Ask something..."
            className="flex-1 border rounded-md px-3 py-2 outline-none lg:min-h-[8vh] "
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded-md lg:min-w-[5vw]" onClick={uploadQuestion}>
            Send
          </button>
        </div>

      </div>

    </div>
  )
}

export default Home