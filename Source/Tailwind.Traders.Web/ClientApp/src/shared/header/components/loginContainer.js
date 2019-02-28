import { connect } from 'react-redux';
import { textAction, submitAction } from '../../../actions/actions';

const mapStateToProps = state => state.login;
const mapDispatchToProps = { textAction, submitAction };

export default connect(mapStateToProps, mapDispatchToProps);