import PropTypes from 'prop-types';
import s from './Container.module.css';

export default function Container({ children }) {
  return <div className={s.Container}>{children}</div>;
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
