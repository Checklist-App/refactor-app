import styled from 'styled-components/native'

export const Container = styled.View`
  gap: 16px;
  flex: 1;
  background-color: ${({ theme }) => theme.color.white};
  padding: 24px;
`

export const ContainerHeader = styled.View`
  width: 100%;
  gap: 8px;
`

export const HeaderUpper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const Title = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const IconContainer = styled.View`
  padding: 12px;
  background-color: ${({ theme }) => theme.color['red-400']};
  border-radius: 12px;
`

export const TitleText = styled.Text`
  font-size: ${(props) => (props.isSmallDevice ? '18px' : '24px')};
  max-width: 75%;
  font-weight: 700;
  font-family: 'Poppins_700Bold';
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const SubTitleRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const SubTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-700']};
`

export const StatusLine = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const StatusLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const StatusContainer = styled.View`
  background-color: ${({ theme }) => theme.color['zinc-400']};
  padding: 8px;
  margin-top: 8px;
`

export const StatusText = styled.Text`
  color: ${({ theme }) => theme.color['zinc-700']};
  font-size: 12px;
  font-weight: bold;
`

export const InfoField = styled.View`
  width: 100%;
  gap: 32px;
`

export const InfoCard = styled.View`
  width: 100%;
  gap: 16px;
`

export const InfoCardTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const InfoCardBody = styled.View`
  gap: 8px;
`

export const InfoCardRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const InfoCardText = styled.View`
  flex-direction: row;
  gap: 8px;
`

export const InfoCardLabel = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const InfoCardValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const InfoCardLabelTask = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const InfoCardValueTask = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const FormInputs = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const FormInput = styled.View`
  width: 49%;
`

export const Buttons = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
