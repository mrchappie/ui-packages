import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  DayInfo,
  generateDaysToDisplay,
  months,
  weekdays,
} from '../DateTimePickerComponent/utils/utils';
import Button from '../DateTimePickerComponent/UI/Button';
import MonthPicker from '../DateTimePickerComponent/UI/MontPicker';
import YearPicker from '../DateTimePickerComponent/UI/YearPicker';

type DatePickerStyle1Props = {
  calendarSelectType: 'single' | 'multiple'; // | 'range';
  onResponse: (date: number) => void;
  defaultDate?: number;
};

const DatePickerStyle1: React.FC<DatePickerStyle1Props> = ({
  calendarSelectType,
  onResponse,
  defaultDate,
}) => {
  // if no default date, set the date to current date
  const DATE = defaultDate ? new Date(defaultDate as number) : new Date();
  const [isYearMonthPickerVisible, setIsYearMonthPickerVisible] =
    useState<boolean>(false);
  const [currentDate] = useState(new Date());

  const [selectedMonth, setSelectedMonth] = useState<number>(DATE.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(DATE.getFullYear());
  const [selectedDayOfTheMonth] = useState<number>(currentDate.getDate());
  const [currentDayOfTheWeek, setCurrentDayOfTheWeek] = useState<number>(
    currentDate.getDay()
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([+DATE.getDate()]);

  // useEffect(() => {
  //   setDayOfTheWeek(selectedDayOfTheMonth);
  // }, [selectedMonth, selectedYear]);

  function setDayOfTheWeek(dayOfTheMonth: number) {
    const dayOfTheWeek = new Date(
      selectedYear,
      selectedMonth,
      dayOfTheMonth
    ).getDay();
    setCurrentDayOfTheWeek(dayOfTheWeek);
  }

  function handleSelectedDays(dayNumber: number) {
    if (calendarSelectType === 'single') {
      setSelectedDays(() => {
        return [Number(dayNumber)];
      });
      handleSendDateBackToUser(dayNumber);
    }
    if (calendarSelectType === 'multiple') {
      setSelectedDays((prevState) => {
        return [...prevState, Number(dayNumber)];
      });
      handleSendDateBackToUser(dayNumber);
    }
    // if (calendarSelectType === 'range') {
    //   setSelectedDays((prevState) => {
    //     return [...prevState, Number(dayNumber)];
    //   });
    //   handleSendDateBackToUser(dayNumber);
    // }
    // setSelectedDayOfTheMonth(dayNumber);
  }

  function handleSendDateBackToUser(dayNumber: number) {
    const date = new Date(selectedYear, selectedMonth, dayNumber).getTime();
    onResponse(date);
  }

  function renderDay({ dayNumber, hideDayBox }: DayInfo) {
    const isCurrentDay = Number(dayNumber) === selectedDayOfTheMonth;
    const isDaySelected = selectedDays.some((day) => day === Number(dayNumber));
    return (
      <Pressable
        onPress={() => {
          if (!hideDayBox) {
            handleSelectedDays(dayNumber);
          }
        }}
        style={[
          styles.day,
          isCurrentDay && styles.isCurrentDay,
          isDaySelected && styles.isDaySelected,
          { opacity: hideDayBox ? 0 : 1 },
        ]}
      >
        <Text
          style={{
            fontWeight: 600,
            userSelect: 'none',
            color: isDaySelected ? '#fff' : '#000',
          }}
        >
          {dayNumber}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <Button
          title={`${months[selectedMonth]} - ${selectedYear.toString()}`}
          defaultSelected
          onButtonPress={() => {
            setIsYearMonthPickerVisible(!isYearMonthPickerVisible);
          }}
        />
      </View>
      {!isYearMonthPickerVisible && (
        <>
          <View style={styles.changeMonthButtons}>
            <Button
              title={`${
                selectedMonth > 0 ? months[selectedMonth - 1] : months[11]
              }`}
              defaultSelected
              onButtonPress={() => {
                setSelectedMonth((prevState) => {
                  if (prevState > 0) {
                    return prevState - 1;
                  } else {
                    setSelectedYear((prevState) => prevState - 1);
                    return 11;
                  }
                });
              }}
            />
            <Button
              title={`${
                selectedMonth < 11 ? months[selectedMonth + 1] : months[0]
              }`}
              defaultSelected
              onButtonPress={() => {
                setSelectedMonth((prevState) => {
                  if (prevState < 11) {
                    return prevState + 1;
                  } else {
                    setSelectedYear((prevState) => prevState + 1);
                    return 0;
                  }
                });
              }}
            />
          </View>

          <View style={styles.calendarContainer}>
            <FlatList
              data={weekdays}
              renderItem={({ item, index }) => {
                const isSelected = currentDayOfTheWeek === index;
                return (
                  <View
                    style={[
                      styles.dayLabel,
                      isSelected && styles.isDayLabelSelected,
                    ]}
                  >
                    <Text style={{ fontWeight: '600', fontSize: 14 }}>
                      {item.slice(0, 3)}
                    </Text>
                  </View>
                );
              }}
              numColumns={7}
              columnWrapperStyle={{ gap: 5 }}
              contentContainerStyle={{ gap: 5 }}
            />
            <FlatList
              data={generateDaysToDisplay(selectedYear, selectedMonth)}
              renderItem={({ item }) => renderDay(item)}
              numColumns={7}
              columnWrapperStyle={{ gap: 5 }}
              contentContainerStyle={{ gap: 5 }}
            />
          </View>
        </>
      )}
      {isYearMonthPickerVisible && (
        <View style={styles.yearMonthPickerContainer}>
          <MonthPicker
            currentMonth={selectedMonth}
            onChange={(monthIndex) => {
              setSelectedMonth(monthIndex);
            }}
          />
          <YearPicker
            currentYear={selectedYear}
            onChange={(year) => {
              setSelectedYear(year);
            }}
          />
        </View>
      )}
      <View style={styles.selectedDateDisplay}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {`${weekdays[currentDayOfTheWeek]}, ${months[selectedMonth]} ${selectedDayOfTheMonth} ${selectedYear}`}
        </Text>
        {!isYearMonthPickerVisible ? (
          <Button title="Today" defaultSelected />
        ) : (
          <Button title="Set date" defaultSelected />
        )}
      </View>
    </View>
  );
};

export default DatePickerStyle1;

const DAY_LABEL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    width: 350,
    gap: 10,
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  headerButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  changeMonthButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    // paddingHorizontal: 20,
  },
  calendarContainer: {
    height: 300,
    // marginVertical: 30,
    // marginHorizontal: 20,
    flexDirection: 'column',
    // backgroundColor: 'green',
  },
  day: {
    width: DAY_LABEL_SIZE,
    height: DAY_LABEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  isCurrentDay: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  isDaySelected: {
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
  },
  dayLabel: { width: DAY_LABEL_SIZE, alignItems: 'center' },
  isDayLabelSelected: {
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
  },
  selectedDateDisplay: {
    position: 'static',
    // bottom: 10,
    // left: 10,
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  yearMonthPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexGrow: 1,
  },
});
