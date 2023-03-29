import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
var debounce = require('lodash.debounce');

const Home = () => {
  const [correctLetters] = useState(["O", "U"])
  const [presentLetters] = useState(["S"])
  const [absentLetters] = useState(["B", "G"])
  const [time_until_next, setTimeUntilNext] = useState('12:00:00')

  const [counts, setCounts] = useState(Array(6).fill(0))

  const [played, setPlayed] = useState(100)
  const [win] = useState(100)
  const [streak] = useState(100)
  const [maxStreak] = useState(100)

  const [showStatsBanner, setShowStatsBanner] = useState(true)
  const [showInfoBanner, setShowInfoBanner] = useState(false)



  useEffect(() => {
    const interval = setInterval(() => {
      let time_until_next = ((new Date()).setHours(24, 0, 0, 0) -  (new Date()).getTime()) / 1000
      var h = String(Math.floor(time_until_next / 3600)).padStart(2, '0');
      var m = String(Math.floor(time_until_next % 3600 / 60)).padStart(2, '0');
      var s = String(Math.floor(time_until_next % 3600 % 60)).padStart(2, '0');

      setTimeUntilNext(`${h}:${m}:${s}`)

    }, 1000);
    return () => clearInterval(interval);
  }, []);


  // Set guesses stochastically (only on client)
  useEffect(() => {
    let tempCounts = [0,0,0,0,0,0]

    setCounts(tempCounts)

    for (let i = 0; i < played; i++)
    {
      let ix = Math.floor(Math.random() * 6 + 1)
      tempCounts[ix - 1] += 1
    }

    setCounts(tempCounts)

  }, [])

  function recalculateValues(e) {
    let tempCounts = [0,0,0,0,0,0]

    setCounts(tempCounts)

    for (let i = 0; i < e.target.innerHTML; i++)
    {
      let ix = Math.floor(Math.random() * 6 + 1)
      tempCounts[ix - 1] += 1
    }

    setCounts(tempCounts)
  }

  let updateCount = useCallback(debounce((e) => {
    let tempCounts = [...counts]
    let tempPlayed = played


    const reg = new RegExp('^[0-9]+$');
    let number = Number(String(e.target.innerHTML).match(reg))

    tempPlayed += number - tempCounts[e.target.id]
    tempCounts[e.target.id] = number

    setCounts(tempCounts)
    setPlayed(tempPlayed)
  }, 500), [counts, played])

  function focusToEnd(e) {
    e.target.focus();
    document.execCommand('selectAll', false, null);
    document.getSelection().collapseToEnd();
  }

  return (
    <div className="flex min-h-screen flex-col items-start justify-start bg-wbackground">
      <Head>
        <title>Fordle - Not The New York Times </title>
        <link rel="icon" href="/wordle.ico" />
      </Head>
      {/* Info Banner */}
      {showInfoBanner &&  
      <div className='w-screen h-screen bg-wbackground absolute flex justify-center items-start text-white text-center font-wordle'>
        <div className='w-[500px] m-4'>
          <div className="w-full flex justify-end mt-4">
            <button onClick={() => {setShowInfoBanner(false)}}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className='mr-4'>
                <path fill="#ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </button>
          </div>
          <h2 className='font-bold mb-2'>WHAT IS THIS</h2>
          <p className='text-left text-sm mb-2'>
            This is a project made by John Sutor for those of us that are too lazy to actually play Wordle day in and 
            day out, but still want the opportunity to flex our knowledge of 5-letter words to our friends. 
          </p>
          <p className='text-left text-sm mb-2'>
            Each number on the statistics page is editable. Just click/tap on the number to 
            change its value. If you update the total number of games played, the values for each number of guesses will 
            be updated to a uniform random number such that all values add to the total number of games played. If a single
            guesses value is changed, the total number of games played will also be updated.
          </p>
        </div>
      </div>}



      {/* Stats Banner */}
      {showStatsBanner && (
        <div className='w-screen h-screen bg-black bg-opacity-50 absolute flex justify-center items-center'>
          <div className='bg-wbackground w-[500px] h-[460px] rounded border border-gray-900 mx-4'>
            <div className="w-full flex justify-end mt-4">
              <button onClick={() => {setShowStatsBanner(false)}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className='mr-4'>
                  <path fill="#ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </button>
            </div>

            <div className='font-wordle flex flex-col items-center text-white gap-2'>
              <h2 className='font-bold'>STATISTICS</h2>
              <div className='flex flex-row justify-center space-x-6 text-center'>
                <div>
                  <p className='text-3xl font-normal' contentEditable={true} onInput={(e) => recalculateValues(e)} onClick={e => focusToEnd(e)} id="played">
                    {played}
                  </p>
                  <p className='text-xs'>
                    Played
                  </p>
                </div>

                <div>
                  <p className='text-3xl font-normal' contentEditable={true} onClick={e => focusToEnd(e)}>
                    {win}
                  </p>
                  <p className='text-xs'>
                    Win %
                  </p>
                </div>

                <div>
                  <p className='text-3xl font-normal' contentEditable={true} onClick={e => focusToEnd(e)}>
                    {streak}
                  </p>
                  <p className='text-xs'>
                    Current<br/>Streak
                  </p>
                </div>

                <div>
                  <p className='text-3xl font-normal' contentEditable={true} onClick={e => focusToEnd(e)}>
                    {maxStreak}
                  </p>
                  <p className='text-xs'>
                    Max<br/>Streak
                  </p>
                </div>
              </div>

              <h2 className='font-bold'>GUESS DISTRIBUTION</h2>
              <div className="flex flex-col w-full text-left px-10 gap-1">
                {[...Array.from(Array(6).keys())].map((i => {
                  return (
                    <div className='flex flex-row w-full' key={`distribution-${i}`}>
                    <p className='mr-1'>{i + 1}</p>
                    <div id={`distribution-bar-${i}`} className="flex h-[20px] text-right items-center justify-end bg-wabsent min-w-[20px]"style={{width:  (counts[i] / Math.max(...counts)) * 100 + '%'}}>
                      <p className="h-full mr-1 mb-[3px]" contentEditable={true} id={i} onInput={(e) => updateCount(e)} onClick={e => focusToEnd(e)}>
                        {counts[i]}
                      </p>
                    </div>
                  </div>
                  )
                }))}
              </div>
              <div className='grid grid-cols-5 grid-rows-1 text-center h-full items-center justify-center mb-8 max-h-[90px]'>
              {/* <div className="flex flex-row justify-around text-center items-center w-full divide-x-2 divide-white h-full"> */}
                <div className='col-span-2'>
                  <h2 className='font-bold my-3'>NEXT WORDLE</h2>
                  <p className=' text-4xl'>{time_until_next}</p>
                </div>
                <div className="h-full border-r mx-auto border-white"></div>
                <a href="https://johnsutor.com" target="_blank" className='bg-wbtncorrect md:w-[176.4px] h-[52px] rounded font-bold text-xl flex items-center justify-center col-span-2 mr-2'>
                  <span className='mr-2'>
                    SHARE
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path fill="#ffffff" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      <main className="flex w-full flex-1 flex-col items-center text-center font-wordle text-white justify-between">
        {/* Navigation */}
        <div className="h-[51px] border-b border-wborder w-full flex flex-row justify-between px-4 items-center">
          <div className="fill-white flex space-x-2 items-center">
            <a href="https://johnsutor.com" target="_blank">
              <svg width="24" height="17" viewBox="0 0 24 17" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.172974" width="20" height="3" rx="1.5" fill="var(--color-tone-1)"></rect>
                <rect x="0.172974" y="7" width="20" height="3" rx="1.5" fill="var(--color-tone-1)"></rect>
                <rect x="0.172974" y="14" width="20" height="3" rx="1.5" fill="var(--color-tone-1)"></rect>
              </svg>
            </a>
            <button onClick={() => {setShowInfoBanner(true)}}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path fill="#ffffff" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
              </svg>
            </button>
          </div>
          <h1 className='font-karnak text-white text-4xl'>
            Wordle
          </h1>
          <div className="fill-white flex space-x-2 items-center">
            <button onClick={() => {setShowStatsBanner(true)}}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path fill="#ffffff" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path>
              </svg>
            </button>
            <a href="https://johnsutor.com" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path fill="#ffffff" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
              </svg>
            </a>
          </div>
        </div>
        {/* ["B", "O", "G", "U", "S", ...Array.from(Array(25).keys())] */}
        {/* Words */}
        <div className='grid grid-rows-6 grid-cols-5 gap-1 font-bold'>
          {[].concat(...Array.from({ length: 6 }, () => ["B", "O", "G", "U", "S"])).map((i) =>{
            return (
              <div className={`h-[62px] w-[62px] flex items-center justify-center ${presentLetters.includes(i)? 'bg-wbtnpresent': correctLetters.includes(i)? 'bg-wbtncorrect': 'bg-wabsent border-wborder border-2 '}`}>
                <p className={`text-4xl $ ? '': "hidden"}`}>{i}</p>
              </div>
            )
          })}
        </div>

        {/* Keyboard */}
        <div className="flex flex-col items-center justify-center font-bold text-sm font-wordle w-full px-2">
          <div className="flex flex-row justify-center space-x-2 mb-2 w-full">
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((l) => {
              return (
                <button data-key={l} id={`keyboard-${l}`} className={`h-[58px] w-[43px] rounded ${presentLetters.includes(l)? 'bg-wbtnpresent': correctLetters.includes(l)? 'bg-wbtncorrect': absentLetters.includes(l)? 'bg-wabsent': 'bg-wbtnneutral'}`}>{l}</button>
              )
            })}
          </div>
          <div className="flex flex-row justify-center space-x-2 mb-2 w-full">
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((l) => {
              return (
                <button data-key={l} id={`keyboard-${l}`} className={`h-[58px] w-[43px] rounded ${presentLetters.includes(l)? 'bg-wbtnpresent': correctLetters.includes(l)? 'bg-wbtncorrect': absentLetters.includes(l)? 'bg-wabsent': 'bg-wbtnneutral'}`}>{l}</button>
              )
            })}
          </div>
          
          <div className="flex flex-row justify-center space-x-2 mb-2 w-full">
            <button data-key="enter" id={`keyboard-enter`} className='h-[58px] w-[65.4px] k bg-wbtnneutral rounded px-1'>
              ENTER
            </button>
            {["Z", "X", "C", "V", "B", "N", "M"].map((l) => {
              return (
                <button data-key={l} id={`keyboard-${l}`} className={`h-[58px] w-[43px] rounded ${presentLetters.includes(l)? 'bg-wbtnpresent': correctLetters.includes(l)? 'bg-wbtncorrect': absentLetters.includes(l)? 'bg-wabsent': 'bg-wbtnneutral'}`}>{l}</button>
              )
            })}
            <button data-key="backspace" id={`keyboard-enter`}className='h-[58px] w-[65.4px] k  bg-wbtnneutral rounded'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className='mx-auto'>
                <path fill="#ffffff" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
