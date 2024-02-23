import {
  ChecklistPeriod,
  ChecklistPeriodImage,
} from '@/src/types/ChecklistPeriod'
import { useEffect, useState } from 'react'
import { ChildrenModel } from '../ChildrenModel'
import { OptionsModel } from '../OptionsModel'
import { Container, QuestionText } from './styles'

interface ChecklistQuestionProps {
  images: ChecklistPeriodImage[]
  currentChecklistPeriod: ChecklistPeriod
  alternativeSelected: number
  setAlternativeSelected: (arg: number) => void
  selectedChild: number
  setSelectedChild: (arg: number) => void
  observationText: string
  setObservationText: (arg: string) => void
}

export function ChecklistQuestion({
  currentChecklistPeriod,
  images,
  alternativeSelected,
  setAlternativeSelected,
  selectedChild,
  setSelectedChild,
  observationText,
  setObservationText,
}: ChecklistQuestionProps) {
  const [needPhoto, setNeedPhoto] = useState(false)
  const [taskChildren, setTaskChildren] = useState([])

  useEffect(() => {
    const option = currentChecklistPeriod.options.find(
      (opt) => opt.id === alternativeSelected,
    )
    if (!option) {
      setNeedPhoto(false)
      setTaskChildren([])
      return
    }
    setNeedPhoto(option.action)

    if (currentChecklistPeriod.task.children?.length) {
      const allChildren = currentChecklistPeriod.task.children
      setTaskChildren(
        allChildren.filter((child) => child.statusId === option.id),
      )
      allChildren.filter((child) => child.statusId === option.id)
    } else {
      setTaskChildren([])
    }
  }, [alternativeSelected, currentChecklistPeriod])

  return (
    <Container>
      <QuestionText>{currentChecklistPeriod.task.description}</QuestionText>

      <OptionsModel
        options={currentChecklistPeriod.options}
        alternativeSelected={alternativeSelected}
        setAlternativeSelected={setAlternativeSelected}
      />

      {(needPhoto || taskChildren.length > 0) && (
        <ChildrenModel
          images={images}
          hasChildren={taskChildren.length > 0}
          hasPhoto={needPhoto}
          checklistPeriod={currentChecklistPeriod}
          childrenOptions={taskChildren}
          observationText={observationText}
          setObservationText={setObservationText}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
        />
      )}
    </Container>
  )
}
