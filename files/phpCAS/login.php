<?php
/**
 * Created by Kihansi
 * Date: 05/10/2018
 * Doc can find at https://github.com/apereo/phpCAS/blob/master/docs/examples/example_simple.php
 */

// Load the CAS lib
require_once 'CAS-1.3.5/CAS.php'; // TODO should pass all params config from argument

//function loginCAS() {
	// Enable debugging
	phpCAS::setDebug();
	// Enable verbose error messages. Disable in production!
	phpCAS::setVerbose(true);
	
	// Initialize phpCAS
	phpCAS::client(CAS_VERSION_2_0,'cas.insa-toulouse.fr',443,'cas', true);
	
	// For production use set the CA certificate that is the issuer of the cert
	// on the CAS server and uncomment the line below
	// phpCAS::setCasServerCACert($cas_server_ca_cert_path);
	
	// To remove on production
	phpCAS::setNoCasServerValidation();
	
	// force CAS authentication
	phpCAS::forceAuthentication();
	
	echo phpCAS::getUser();

	foreach (phpCAS::getAttributes() as $key => $value) {
		if (is_array($value)) {
			echo '<li>', $key, ':<ol>';
			foreach ($value as $item) {
				echo '<li><strong>', $item, '</strong></li>';
			}
			echo '</ol></li>';
		} else {
			echo '<li>', $key, ': <strong>', $value, '</strong></li>' . PHP_EOL;
		}
	}
	
	//return true;
//}

