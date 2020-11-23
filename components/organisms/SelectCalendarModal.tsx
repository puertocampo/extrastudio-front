import React, { useState, useEffect } from 'react';
import { Button, Text, View, ScrollView, FlatList, NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { Button as EleButton } from "react-native-elements";
import Modal from 'react-native-modal';
import Firebase from "../../firebase";
import { ICalendar } from "../../type/calendar";
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { bindActionCreators, Dispatch } from 'redux';

interface CalendarListItemProps {
  calendar: ICalendar,
  handleClick(calendarId: string): void;
}
const CalenderListItem = ({ calendar, handleClick }: CalendarListItemProps) =>
  (<Button key={calendar.id} title={calendar.title} onPress={() => { handleClick(calendar.id) }} />)

type PropsFromRedux = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type OwnProps = {
  isOpen: boolean;
  handleClose(): void;
}
const SelectCalendarModal = (props: PropsFromRedux & OwnProps) => {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    Firebase.fetchCalendarLists().then(calendars => {
      setCalendars(calendars);
    });
  }, [])

  const handleSetCalendar = (calendarId: string) => {
    props.setUser({ ...props.user, calendarId });
    props.handleClose();
  }

  return (
    <Modal isVisible={props.isOpen}>
      <View style={{
        flex: 1, backgroundColor: "#fff", marginHorizontal: 5,
        marginVertical: 40, padding: 25, borderRadius: 5
      }}>
        <View
          style={{ flexDirection: 'row' }}
        >
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: "#000", lineHeight: 24, marginRight: 10 }}
          >
            イベントを追加するカレンダーを選択してください
          </Text>
          <EleButton onPress={props.handleClose}
            buttonStyle={{ backgroundColor: 'transparent' }}
            icon={<Icon
              name='times'
              color="rgba(0, 0, 0, 0.4)"
              size={25}
            />}
          />
        </View>
        <ScrollView>
          {
            calendars.map((calendar: ICalendar) => (<CalenderListItem calendar={calendar} handleClick={handleSetCalendar} />))
          }
        </ScrollView>
      </View>
    </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectCalendarModal);
