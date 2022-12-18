import {useEffect, useRef, useState} from 'preact/hooks'
import styled, {css} from '../../src/styled'
import tstyled, {Container, tss} from '../../src/tstyled'
import {transpileAndAddToDom} from '../../src/css'

tss`
	body {/* body comment */}
		background: black
	@media (width > 500px)
		body
			background: #333
`

tss`
	{/* Now for some ugly code!! */}
	
	h1,
	{/* multi-line
			comment 
	*/}
	h2,
	h3,h4,
	h5

		color: white
	
`

css`
	body {
		color: lightgray;
	}
`

let renderCount = 0

// TODO: fluid font
export function App() {
	const on = useOn()
	const [ref, width] = useWidth()

	const Div = styled.div`
		:root {
			color: #55f;
		}
	`

	const P = tstyled.a`
		:root
			color: ${on ? 'white' : 'red'}
		@container (width > 400px) and (width > 800px)
			:root
				color: ${on ? 'white' : 'pink'}
	`

	let expectedColor = ''
	if (width > 400 && width > 800) {
		expectedColor = on ? 'white' : 'pink'
	} else {
		expectedColor = on ? 'white' : 'red'
	}

	return (
		<Container forwardRef={ref as any}>
			<Div>THIS SHOULD BE Blue</Div>
			<h3>THIS SHOULD BE WHITE</h3>
			<P>THIS SHOULD BE {expectedColor.toUpperCase()}</P>
			<p>RenderCount: {renderCount++}</p>
			<p>Container Width: {width}</p>
			<p>Transpile Count: 7 &lt;= {transpileAndAddToDom.count}</p>
		</Container>
	)
}

/** A hook that just return a boolean that oscilates on/off */
function useOn() {
	const [on, setOn] = useState(false)
	useEffect(() => {
		const interval = setInterval(() => {
			setOn((on) => !on)
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	return on
}

function useWidth() {
	const ref = useRef<HTMLElement>()
	const getWidth = () => ref.current?.clientWidth ?? 0
	const [width, setWidth] = useState(getWidth())

	useEffect(() => {
		const upsertWidth = () => {
			const newWidth = getWidth()
			if (newWidth !== width) setWidth(getWidth())
		}
		const int = setInterval(upsertWidth, 500)
		return () => clearInterval(int)
	}, [])

	return [ref, width]
}
