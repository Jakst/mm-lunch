import React, { CSSProperties, useState } from 'react'
import './App.css'

function App() {
	const today = new Date()

	const [monthOffset, setMonthOffset] = useState(0)
	const selectedDate = new Date(
		today.getUTCFullYear(),
		today.getUTCMonth() + monthOffset
	)

	function decrease() {
		setMonthOffset((m) => m - 1)
	}

	function increase() {
		setMonthOffset((m) => Math.min(m + 1, 0))
	}

	const year = selectedDate.getUTCFullYear()
	const monthName = selectedDate.toLocaleString('default', { month: 'long' })
	const nextMonthDisabled = monthOffset === 0

	return (
		<div
			style={{
				cursor: 'default',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: 'white',
				borderRadius: 10,
				paddingBottom: 20,
			}}
		>
			<div
				style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: 260,
					}}
				>
					<button
						type="button"
						onClick={decrease}
						style={{ display: 'flex', padding: 7 }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							color="#00ff00"
						>
							<path
								transform="scale(-1,1) translate(-24, 0)"
								d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"
								color="#ff0000"
							/>
						</svg>
					</button>

					<h1 style={{ fontSize: 18 }}>
						{monthName}, {year}
					</h1>

					<button
						type="button"
						onClick={increase}
						style={{ display: 'flex', padding: 7 }}
						disabled={nextMonthDisabled}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							color="#00ff00"
						>
							<path
								d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"
								fill={nextMonthDisabled ? '#ddd' : 'black'}
							/>
						</svg>
					</button>
				</div>
			</div>

			<Grid key={selectedDate.toISOString()} date={selectedDate} />
		</div>
	)
}

function getDaysInMonth(date: Date) {
	const year = date.getUTCFullYear()
	const month = date.getUTCMonth() + 2

	return new Date(year, month, 0).getDate()
}

const GRID_GAP = 1

const ssstyle: CSSProperties = {
	width: 40,
	margin: GRID_GAP,
	padding: 4,
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}

function Grid({ date }: { date: Date }) {
	const dayInWeek = (date.getDay() + 6) % 7
	const daysInMonth = getDaysInMonth(date)
	const padding = Array.from(Array(dayInWeek))
	const dates = Array.from(Array(daysInMonth)).map((_, i) => i + 1)

	const all = [padding]

	dates.forEach((d, i) => {
		const realIndex = dayInWeek + i
		const row = Math.floor(realIndex / 7)
		const column = realIndex % 7

		if (column === 0) all[row] = [d]
		else all[row].push(d)
	})

	const yearInView = date.getUTCFullYear()
	const monthInView = date.getUTCMonth() + 1

	function isToday(d: number) {
		const todaysDate = new Date()

		const sameYear = todaysDate.getUTCFullYear() === yearInView
		const sameMonth = todaysDate.getUTCMonth() === monthInView
		const sameDate = d === todaysDate.getDate()

		return sameYear && sameMonth && sameDate
	}

	const yearAndMonthString = `${yearInView}-${monthInView}`

	const [savedData, setSavedData] = useState(
		JSON.parse(localStorage.getItem(yearAndMonthString) ?? '{}') as Record<
			string,
			boolean
		>
	)

	const lunchCount = Object.values(savedData).filter(Boolean).length

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				height: 240,
				width: 360,
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					...noTextSelect,
				}}
			>
				<div>
					{all.map((row, i) => (
						<div
							key={`${yearAndMonthString}-${i}`}
							style={{
								height: 32,
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								margin: GRID_GAP,
							}}
						>
							{row.map((dayInMonth, j) => {
								const key = `${yearAndMonthString}-${i}-${j}`

								const dateString = new Date(
									yearInView,
									monthInView,
									dayInMonth
								).toLocaleDateString('sv-SE')

								let state: 'none' | 'yeh' | 'bleh' = 'none'
								if (dayInMonth) {
									if (savedData.hasOwnProperty(dateString)) {
										state = savedData[dateString] ? 'yeh' : 'bleh'
									}
								}

								if (!dayInMonth) return <span key={key} style={ssstyle}></span>

								const td = isToday(dayInMonth) ? (
									<span
										style={{
											borderRadius: 999,
											border: '3px solid #eb9f9f ',
											padding: 2,
										}}
									>
										{dayInMonth}
									</span>
								) : (
									dayInMonth
								)

								const isWeekend = j > 4
								if (isWeekend)
									return (
										<span key={key} style={{ ...ssstyle, opacity: 0.3 }}>
											{td}
										</span>
									)

								const isSet = state !== 'none'

								function toggleValue() {
									const newData = {
										...savedData,
										[dateString]:
											state === 'none' || state === 'bleh' ? true : false,
									}

									setSavedData(newData)
									localStorage.setItem(
										yearAndMonthString,
										JSON.stringify(newData)
									)
								}

								return (
									<span
										key={key}
										style={{
											...ssstyle,
											border: !isSet ? '1px solid #aaa' : 'none',
											borderRadius: 4,
											position: 'relative',
											cursor: 'pointer',
										}}
										onClick={toggleValue}
									>
										{td}

										{!isWeekend && state !== 'none' && (
											<span
												style={{
													fontSize: 7,
													position: 'absolute',
													bottom: 6,
													right: 0,
												}}
											>
												{/* {state === 'yeh' ? '✅' : '❌'} */}
												{state === 'yeh' ? '✅' : '⚪️'}
											</span>
										)}
									</span>
								)
							})}
						</div>
					))}
				</div>
			</div>

			<h3 style={{ margin: 0, marginLeft: 32, textAlign: 'left' }}>
				<span
					style={{ textDecoration: 'underline', textDecorationThickness: 2 }}
				>
					{lunchCount || 'No '} {lunchCount === 1 ? 'lunch' : 'lunches'}{' '}
				</span>

				<span style={{ fontWeight: 'normal' }}>
					in {date.toLocaleString('default', { month: 'long' })}
				</span>
			</h3>
		</div>
	)
}

const noTextSelect: React.CSSProperties = {
	userSelect: 'none',
	msUserSelect: 'none',
	MozUserSelect: 'none',
	WebkitUserSelect: 'none',
}

export default App
