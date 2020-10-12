import React, { useState } from 'react';
import './styles.scss';

interface CheckboxGroupProps {
  name: string;
  label: string;
  childLabelValues: { label: string; value: any }[];
  onChange: any;
  checkedVals?: any[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  const [checkedVals, setCheckedVals] = useState([]);

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedVals = event.target.checked
      ? [...checkedVals, event.target.name]
      : checkedVals.filter((c: any) => c !== event.target.name);

    setCheckedVals(newCheckedVals);
    props.onChange(newCheckedVals);
  };

  return (
    <div className="cb-container">
      <legend>{props.label}</legend>
      <div className="input-container">
        {props.childLabelValues.map((lv, i) => (
          <label>
            <input
              type="checkbox"
              key={i}
              name={lv.value}
              checked={checkedVals.includes(lv.value)}
              onChange={onCheckboxChange}
            ></input>
            {lv.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
