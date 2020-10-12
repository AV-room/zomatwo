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
  // just reading that this is an anti-pattern
  // const [checkedVals, setCheckedVals] = useState(props.checkedVals || []);

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedVals = event.target.checked
      ? [...props.checkedVals, event.target.name]
      : props.checkedVals.filter((c: any) => c !== event.target.name);

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
              checked={props.checkedVals.includes(lv.value)}
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
