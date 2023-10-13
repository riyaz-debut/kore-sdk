/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '.', '../..', 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
const config = require('../../config/app');


class CAClient {

    /**
     * Enroll admin user
     * @param username username of user
     * @param password secret
     */
    async registerAdmin(username = 'admin', password = 'adminpw') {
        try {
            // Create a new CA client for interacting with the CA.
            const caInfo = ccp.certificateAuthorities[config.ca_url];
            const caTLSCACerts = caInfo.tlsCACerts.pem;
            const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the admin user.
            const identity = await wallet.get(username);
            if (identity) {
                return {
                    status: 400,
                    data: {
                        message: `An identity for the admin user "${username}" already exists in the wallet`
                    }
                };
            }

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: password });

            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: config.org_mspid,
                type: 'X.509',
            };

            // const x509Identity = {
            //     credentials: {
            //         certificate: fs.readFileSync(`./organizations/peerOrganizations/${config.org_name}/ca/ca-cert.pem`, 'utf8'),
            //         privateKey: fs.readFileSync(`./organizations/peerOrganizations/${config.org_name}/ca/key.pem`, 'utf8'),
            //     },
            //     mspId: config.org_mspid,
            //     type: 'X.509',
            // };

            // console.log(x509Identity);

            await wallet.put(username, x509Identity);

            console.log(`Successfully enrolled admin user "${username}" and imported it into the wallet`);
            return {
                status: 200,
                data: {
                    message: `Successfully enrolled admin user "${username}" and imported it into the wallet`
                }
            };
        } catch (error) {
            console.error(`Failed to enroll admin user "${username}": ${error}`);
            return {
                status: 400,
                data: {
                    message: `Failed to enroll admin user "${username}": ${error}`
                }
            };
        }
    }

    /**
     * Register & enroll user with CA
     * @param username - username
     * @param secret - secret key
     */
    async registerUser(username) {
        try {
            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities[config.ca_url].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(username);
            if (userIdentity) {
                return {
                    status: 400,
                    data: {
                        message: `An identity for the user "${username}" already exists in the wallet`
                    }
                };
            }

            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                return {
                    status: 400,
                    data: {
                        message: 'An identity for the admin user "admin" does not exist in the wallet'
                    }
                };
            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: username,
                role: 'client'
            }, adminUser);

            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret
            });

            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: config.org_mspid,
                type: 'X.509',
            };
            await wallet.put(username, x509Identity);
            console.log(`Successfully registered and enrolled user "${username}" and imported it into the wallet`);

            return {
                status: 200,
                data: {
                    message: `Successfully registered and enrolled user "${username}" and imported it into the wallet`
                }
            };
        } catch (error) {
            console.error(`Failed to register user "${username}": ${error}`);
            return {
                status: 400,
                data: {
                    message: `Failed to register user "${username}": ${error}`
                }
            };
        }
    }
}
module.exports = CAClient;
