import React, { Dispatch, SetStateAction } from 'react'
import classNames from 'classnames';

type Props = {
  fieldName: string;
  fieldDesc: string;
  fieldValue: string;
  error: string;
  setFieldValue: Dispatch<SetStateAction<string>>;
  inputType: 'input' | 'textarea';
}

export default function CreateSubInput({ 
  fieldName, 
  fieldDesc, 
  fieldValue, 
  error, 
  setFieldValue,
  inputType
}: Props) {
  return (
    <div className="my-6">
      <p className="font-medium">{fieldName}</p>
      <p className="mb-2 text-xs text-gray-500">{fieldDesc}</p>
      {inputType === 'input' ? (
        <input 
          type="text" 
          className={
            classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500",
              { 'border-red-600': error })}
          value={fieldValue}
          onChange={e => setFieldValue(e.target.value)}  
        />
      ) : (
        <textarea 
          className={
            classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500",
              { 'border-red-600': error })}
          value={fieldValue}
          onChange={e => setFieldValue(e.target.value)}  
        />
      )}
      <small className="font-medium text-red-600">{error}</small>
    </div>
  )
}
