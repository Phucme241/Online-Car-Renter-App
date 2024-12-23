import React from "react";
import styled from "styled-components";

const Input = ({ value, onChange, placeholder }) => {
  return (
    <StyledWrapper>
      <div className="input-group">
        <input
          required
          type="text"
          name="text"
          autoComplete="off"
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange} // Sử dụng hàm onChange từ props
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-group {
    position: relative;
    margin-top: 40px;
    margin-left: 20px;
  }

  .input {
    width: 600px;
    border: solid 1.5px #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1rem;
    font-size: 1rem;
    color: #f5f5f5;
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-label {
    position: absolute;
    left: 15px;
    color: #e8e8e8;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input:focus,
  .input:valid {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  .input:focus ~ .user-label,
  .input:valid ~ .user-label {
    transform: translateY(-50%) scale(0.8);
    background-color: #212121;
    padding: 0 0.2em;
    color: #2196f3;
  }
`;

export default Input;
