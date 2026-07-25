import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { INTERVIEW_API_END_POINT, JOB_API_END_POINT } from '@/utlis/constant'
import { setSingleJob } from '@/redux/jobSlice'

const Interview = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector(store => store.auth)
    const { singleJob } = useSelector(store => store.job)

    const [status, setStatus] = useState('idle') // idle | starting | in_progress | submitting | complete | error
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages] = useState([]) // { role: 'ai' | 'user', text }
    const [difficulty, setDifficulty] = useState(null)
    const [answerInput, setAnswerInput] = useState('')
    const [summary, setSummary] = useState(null) // { summary, score, weakTopics }
    const [errorMessage, setErrorMessage] = useState('')

    const chatEndRef = useRef(null)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchJob()
    }, [jobId, dispatch])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, status])

    const beginInterviewHandler = async () => {
        setStatus('starting')
        setErrorMessage('')
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/start`, { jobId }, { withCredentials: true })
            setSessionId(res.data.sessionId)
            setDifficulty(res.data.difficulty)
            setMessages([{ role: 'ai', text: res.data.question }])
            setStatus('in_progress')
        } catch (error) {
            console.log(error)
            setErrorMessage(error?.response?.data?.message || 'Could not start the interview. Please try again.')
            setStatus('error')
        }
    }

    const submitAnswerHandler = async () => {
        const answer = answerInput.trim()
        if (!answer || status === 'submitting') return

        setMessages(prev => [...prev, { role: 'user', text: answer }])
        setAnswerInput('')
        setStatus('submitting')

        try {
            const res = await axios.post(
                `${INTERVIEW_API_END_POINT}/answer`,
                { sessionId, answer },
                { withCredentials: true }
            )

            if (res.data.status === 'complete') {
                setSummary({
                    summary: res.data.summary,
                    score: res.data.score,
                    weakTopics: res.data.weakTopics || []
                })
                setStatus('complete')
            } else {
                setDifficulty(res.data.difficulty)
                setMessages(prev => [...prev, { role: 'ai', text: res.data.question }])
                setStatus('in_progress')
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Something went wrong submitting your answer')
            setAnswerInput(answer)
            setStatus('in_progress')
        }
    }

    const practiceAgainHandler = () => {
        setStatus('idle')
        setSessionId(null)
        setMessages([])
        setDifficulty(null)
        setAnswerInput('')
        setSummary(null)
        setErrorMessage('')
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl mb-1'>Mock Interview</h1>
                <p className='text-gray-600 mb-6'>
                    {singleJob?.title ? `Practicing for: ${singleJob.title}` : 'Loading job details...'}
                </p>

                {status === 'idle' && (
                    <div className='rounded-2xl border border-gray-200 shadow-lg p-8 text-center'>
                        <p className='text-gray-700 mb-6'>
                            Practice answering interview questions tailored to this role. Difficulty adapts as
                            you go, and vague answers get a follow-up before moving on.
                        </p>
                        <Button onClick={beginInterviewHandler} className='rounded-lg bg-[#7209b7] hover:bg-[#5f32ad]'>
                            Begin Interview
                        </Button>
                    </div>
                )}

                {status === 'starting' && (
                    <div className='flex items-center justify-center gap-2 text-gray-600 py-10'>
                        <Loader2 className='h-5 w-5 animate-spin' /> Setting up your interview...
                    </div>
                )}

                {status === 'error' && (
                    <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-center'>
                        <p className='text-red-700 mb-4'>{errorMessage}</p>
                        <Button onClick={beginInterviewHandler} className='rounded-lg bg-[#7209b7] hover:bg-[#5f32ad]'>
                            Try Again
                        </Button>
                    </div>
                )}

                {(status === 'in_progress' || status === 'submitting') && (
                    <div className='rounded-2xl border border-gray-200 shadow-lg p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <Badge className='text-[#7209b7] font-bold' variant="ghost">
                                Difficulty: {difficulty}/5
                            </Badge>
                        </div>

                        <div className='space-y-3 max-h-[50vh] overflow-y-auto mb-4 pr-2'>
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-[#7209b7] text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {status === 'submitting' && (
                                <div className='flex justify-start'>
                                    <div className='rounded-lg px-4 py-2 bg-gray-100 text-gray-500 flex items-center gap-2'>
                                        <Loader2 className='h-4 w-4 animate-spin' /> Interviewer is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className='flex items-end gap-2'>
                            <textarea
                                value={answerInput}
                                onChange={(e) => setAnswerInput(e.target.value)}
                                disabled={status === 'submitting'}
                                placeholder='Type your answer...'
                                rows={3}
                                className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7209b7] disabled:bg-gray-100'
                            />
                            <Button
                                onClick={submitAnswerHandler}
                                disabled={status === 'submitting' || !answerInput.trim()}
                                className='rounded-lg bg-[#7209b7] hover:bg-[#5f32ad]'>
                                {status === 'submitting' ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Submit Answer'}
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'complete' && summary && (
                    <div className='rounded-2xl border border-gray-200 shadow-lg p-8'>
                        <h2 className='font-bold text-lg mb-2'>Interview Complete</h2>
                        <p className='text-gray-700 mb-4'>
                            Overall score: <span className='font-bold'>{Number(summary.score).toFixed(1)} / 5</span>
                        </p>
                        <p className='text-gray-700 mb-4'>{summary.summary}</p>
                        {summary.weakTopics.length > 0 && (
                            <div className='mb-6'>
                                <p className='font-semibold mb-2'>Areas to review:</p>
                                <div className='flex flex-wrap gap-2'>
                                    {summary.weakTopics.map((topic, idx) => (
                                        <Badge key={idx} className='text-[#F83002] font-bold' variant="ghost">{topic}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='flex gap-2'>
                            <Button onClick={practiceAgainHandler} className='rounded-lg bg-[#7209b7] hover:bg-[#5f32ad]'>
                                Practice Again
                            </Button>
                            <Button onClick={() => navigate(`/decsription/${jobId}`)} variant="outline" className='rounded-lg'>
                                Back to Job
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Interview
