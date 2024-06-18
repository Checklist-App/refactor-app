import { HStack } from 'native-base'
import { Button } from '../Button'
import {
  IndicatorContainer,
  IndicatorThumb,
  PaginationText
} from './styles'

interface QuestionPaginatorProps {
  numberOfQuestions: number
  currentQuestionIndex: number
  handleNext: () => void
  handlePrev: () => void
  nextDisabled: boolean
  prevDisabled: boolean
}

export function QuestionPaginator({
  handleNext,
  handlePrev,
  numberOfQuestions,
  currentQuestionIndex,
  prevDisabled,
  nextDisabled,
}: QuestionPaginatorProps) {
  return (
    <HStack
      space={2}
      alignItems="center"
    >
      <Button.Trigger onPress={handlePrev} disabled={prevDisabled} onlyIcon>
        <Button.Icon.CaretLeft />
      </Button.Trigger>
      <IndicatorContainer>
        <IndicatorThumb
          width={`${((currentQuestionIndex + 1) * 100) / numberOfQuestions}%`}
        />
      </IndicatorContainer>
      <PaginationText>
        {currentQuestionIndex + 1}/{numberOfQuestions}
      </PaginationText>
      <Button.Trigger onPress={handleNext} onlyIcon disabled={nextDisabled}>
        <Button.Icon.CaretRight />
      </Button.Trigger>
    </HStack>
  )
}
