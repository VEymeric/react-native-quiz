import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import base64 from 'react-native-base64'

const Quiz = () => {
	const getQuiz=async()=>{
		try{
			const url='https://opentdb.com/api.php?amount=10&type=multiple&encode=base64';
			const res = await fetch(url);
			const data = await res.json();
			console.log(data.results);
			let array1 = [];
			for(var i=0; i<data.results.length;i++){
				var list = {};
				list["question"] = base64.decode(data.results[i].question, 'base64').replace("/Ãº/g", "ú").replace("/Ã«/g", "û");
				list["options"] = [];
				for(var j=0 ; j<data.results[i].incorrect_answers.length ; j++){
					list["options"].push(base64.decode(data.results[i].incorrect_answers[j], 'base64').replace("/Ãº/g", "ú").replace("/Ã«/g", "û"));
				}
				list["options"].push(base64.decode(data.results[i].correct_answer, 'base64').replace("/Ãº/g", "ú").replace("/Ã«/g", "û"));
				list["options"].sort();
				list["correct_option"] = base64.decode(data.results[i].correct_answer, 'base64').replace("/Ãº/g", "ú").replace("/Ã«/g", "û");
				console.log(list)

				array1.push(list)
			}

			setallQuestions(array1);

		}catch (error){
			console.log(error);
		}
	}
	const [allQuestions, setallQuestions] = useState([{
		question: "During which American Civil War campaign did Union troops dig a tunnel beneath Confederate troops to detonate explosives underneath them?",
		options: ["Jupiter","Saturn","Neptune","Mercury"].sort(),
		correct_option: "Jupiter"
	},]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
	const [correctOption, setCorrectOption] = useState(null);
	const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
	const [score, setScore] = useState(0)
	const [showNextButton, setShowNextButton] = useState(false)
	const [showScoreModal, setShowScoreModal] = useState(false)
	const validateAnswer = (selectedOption) => {
		let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
		setCurrentOptionSelected(selectedOption);
		setCorrectOption(correct_option);
		setIsOptionsDisabled(true);
		if(selectedOption==correct_option){
			// Set Score
			setScore(score+1)
		}
		// Show Next Button
		setShowNextButton(true)
	}
	const handleNext = () => {
		if(allQuestions == null){
			return;
		}
		if(currentQuestionIndex== allQuestions.length-1){
			// Last Question
			// Show Score Modal
			setShowScoreModal(true);
		}else{
			setCurrentQuestionIndex(currentQuestionIndex+1);
			setCurrentOptionSelected(null);
			setCorrectOption(null);
			setIsOptionsDisabled(false);
			setShowNextButton(false);
		}
		Animated.timing(progress, {
			toValue: currentQuestionIndex+1,
			duration: 1000,
			useNativeDriver: false
		}).start();
	}
	const restartQuiz = () => {
		getQuiz()
		setShowScoreModal(false);

		setCurrentQuestionIndex(0);
		setScore(0);

		setCurrentOptionSelected(null);
		setCorrectOption(null);
		setIsOptionsDisabled(false);
		setShowNextButton(false);
		Animated.timing(progress, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: false
		}).start();
	}



	const renderQuestion = () => {
		return (
			<View style={{
				marginVertical: 40
			}}>
				{/* Question Counter */}
				<View style={{
					flexDirection: 'row',
					alignItems: 'flex-end'
					
				}}>
					<Text style={{color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2}}>{currentQuestionIndex+1}</Text>
					<Text style={{color: COLORS.white, fontSize: 18, opacity: 0.6}}>/ {allQuestions.length}</Text>
				</View>

				{/* Question */}
				<Text style={{
					color: COLORS.white,
					fontSize: 130 < (allQuestions[currentQuestionIndex]?.question.length) ? 20 : 30,

				}}>{allQuestions[currentQuestionIndex]?.question}</Text>
			</View>
		)
	}
	useEffect(()=>{
		getQuiz()
	},[])
	const renderOptions = () => {
		return (
			<View>
				{
					allQuestions[currentQuestionIndex]?.options.map(option => (
						<TouchableOpacity 
							onPress={()=> validateAnswer(option)}
							disabled={isOptionsDisabled}
							key={option}
							style={{
								borderWidth: 3, 
								borderColor: option==correctOption 
								? COLORS.success
								: option==currentOptionSelected 
								? COLORS.error 
								: COLORS.secondary+'40',
								backgroundColor: option==correctOption 
								? COLORS.success +'20'
								: option==currentOptionSelected 
								? COLORS.error +'20'
								: COLORS.secondary+'20',
								height: 60, borderRadius: 20,
								flexDirection: 'row',
								alignItems: 'center', justifyContent: 'space-between',
								paddingHorizontal: 20,
								marginVertical: 10
							}}
						>
						<Text style={{fontSize: 20, color: COLORS.white}}>{option}</Text>
						{/* Show Check Or Cross Icon based on correct answer*/}
						{
							option==correctOption ? (
								<View style={{
									width: 30, height: 30, borderRadius: 30/2,
									backgroundColor: COLORS.success,
									justifyContent: 'center', alignItems: 'center'
								}}>
								<MaterialCommunityIcons name="check" 
									style={{
										color: COLORS.white,
										fontSize: 20
									}} />
								</View>
							): option == currentOptionSelected ? (
								<View 
									style={{
										width: 30, height: 30, borderRadius: 30/2,
										backgroundColor: COLORS.error,
										justifyContent: 'center', alignItems: 'center'
									}}>
									<MaterialCommunityIcons name="close" style={{
										color: COLORS.white,
										fontSize: 20
									}} />
								</View>
							) : null
						}
					</TouchableOpacity>
				))
				}
			</View>
		)
	}
	const renderNextButton = () => {
		if(showNextButton){
			return (
				<TouchableOpacity
				onPress={handleNext}
				style={{
					marginTop: 20, width: '100%', backgroundColor: COLORS.accent, padding: 20, borderRadius: 5
				}}>
					<Text style={{fontSize: 20, color: COLORS.white, textAlign: 'center'}}>Next</Text>
				</TouchableOpacity>
			)
		}else{
			return null
		}
	}

	const [progress, setProgress] = useState(new Animated.Value(0));
	const progressAnim = progress.interpolate({
		inputRange: [0, allQuestions.length-1],
		outputRange: ['0%','100%']
	})
	const renderProgressBar = () => {
		return (
			<View style={{
				width: '100%',
				height: 20,
				borderRadius: 20,
				backgroundColor: '#00000020',

			}}>
				<Animated.View style={[{
					height: 20,
					borderRadius: 20,
					backgroundColor: COLORS.accent
				},{
					width: progressAnim
				}]}>
				</Animated.View>
			</View>
		)
	}
	return (
		<SafeAreaView style={{
			flex: 1,
			backgroundColor: COLORS.background,
			width:'100%'


		}}>
			<StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
			<View style={{
				flex: 1,
				paddingVertical: 40,
				paddingHorizontal: 16,
				position:'relative',
			}}>
				{/* ProgressBar */}
				{ renderProgressBar() }
				{/* Question */}
				{renderQuestion()}
				{/* Options */}
				{renderOptions()}
				{/* Next Button */}
				{renderNextButton()}
				{/* Score Modal */}
				<Modal
				animationType="slide"
				transparent={true}
				visible={showScoreModal}
				>
					<View style={{
						flex: 1,
						backgroundColor: COLORS.primary,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<View style={{
							backgroundColor: COLORS.white,
							width: '90%',
							borderRadius: 20,
							padding: 20,
							alignItems: 'center'
						}}>
							<Text style={{fontSize: 30, fontWeight: 'bold'}}>{ score> (allQuestions.length/2) ? 'Congratulations!' : 'Oops!' }</Text>
							<View style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								marginVertical: 20
							}}>
								<Text style={{
									fontSize: 30,
									color: score> (allQuestions.length/2) ? COLORS.success : COLORS.error
								}}>{score}</Text>
								<Text style={{
									fontSize: 20, color: COLORS.black
								}}>/ { allQuestions.length }</Text>
							</View>
							{/* Retry Quiz button */}
							<TouchableOpacity
							onPress={restartQuiz}
							style={{
								backgroundColor: COLORS.accent,
								padding: 20, width: '100%', borderRadius: 20
							}}>
								<Text style={{
									textAlign: 'center', color: COLORS.white, fontSize: 20
								}}>Retry Quiz</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				{/* Background Image */}
				
			</View>
		</SafeAreaView>
	);
}
export default Quiz;