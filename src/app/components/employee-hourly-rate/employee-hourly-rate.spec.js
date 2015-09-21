/**
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   GPL-3.0
 */
'use strict';

import employee from '../../core/resources/employee/fixtures/employee_1.json!json';
import EmployeeHourlyRate from './employee-hourly-rate.js';

describe('EmployeeHourlyRate', () => {

    beforeEach(angular.mock.module('ngDecorator'));

    describe('Component', () => {
        let $compile, $rootScope, scope, render, element, EmployeeModel,
            component = '<employee-hourly-rate></employee-hourly-rate>',
            itemMock = {currencyCode: 'currencyCodeMock', currencySymbol: 'currencySymbolMock'};

        beforeEach(inject((_$compile_, _$rootScope_, _EmployeeModel_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            EmployeeModel = _EmployeeModel_;

            spyOn(EmployeeModel, 'getItem').and.returnValue(itemMock);

            render = () => {
                let element = angular.element(component);
                let compiledElement = $compile(element)(scope);
                $rootScope.$digest();

                return compiledElement;
            };
        }));

        it('should have `employee-hourly-rate` component', () => {
            element = render();

            expect(element.controller('employeeHourlyRate')).toBeDefined();
            expect(element['0']).not.toEqual(component);
        });

        it('should have `Hourly Rate` title defined', () => {
            element = render();
            const title = element.find('legend');

            expect(title.text()).toEqual('Hourly Rate');
        });

        describe('Form fields', () => {
            describe('hourlyRate', () => {
                it('should have `Hourly Rate` label defined', () => {
                    element = render();
                    const parentElement = angular.element(element[0].querySelector('input[name="hourlyRate"][type="number"]')).parent().parent();

                    expect(parentElement.find('label').text()).toEqual('Hourly Rate');
                });

                it('should show `hourlyRate` required error message', () => {
                    element = render();
                    element.triggerHandler('submit');
                    element.isolateScope().employeeHourlyRateForm.$submitted = true; // FIXME: why $submitted is not set by triggerHandler?
                    scope.$digest();

                    const errorMessage = angular.element(element[0].querySelector('input[name="hourlyRate"][type="number"] ~ div > div[ng-message="required"]'));

                    expect(errorMessage.text()).toEqual('This field is required.');
                });

                //FIXME: why invalid message error is not trigger
                xit('should show `hourlyRate` number error message', () => {
                    element = render();
                    const inputField = angular.element(element[0].querySelector('input[name="hourlyRate"][type="number"]'));
                    inputField.val('-1');
                    inputField.triggerHandler('input');
                    element.triggerHandler('submit');
                    element.isolateScope().employeeHourlyRateForm.$submitted = true; // FIXME: why $submitted is not set by triggerHandler?
                    scope.$digest();

                    const errorMessage = angular.element(element[0].querySelector('input[name="hourlyRate"][type="number"] ~ div > div[ng-message="number"]'));

                    expect(errorMessage.text()).toEqual('Invalid number.');
                });

                it('should show currencyCode', () => {
                    element = render();

                    const currencyCode = angular.element(element[0].querySelector('div.currencyCode'));

                    expect(currencyCode.text()).toEqual(itemMock.currencyCode);
                });
            });
        });

        it('should submit is clicked', function () {
            element = render();

            const hourlyRateInputField = angular.element(element[0].querySelector('input[name="hourlyRate"][type="number"]'));
            hourlyRateInputField.val(employee.hourlyRate);
            hourlyRateInputField.triggerHandler('input');

            expect(element.isolateScope().employeeHourlyRateForm).toBeDefined();
            expect(element.isolateScope().vm.employee.hourlyRate).toEqual(employee.hourlyRate);
            expect(element.isolateScope().employeeHourlyRateForm.$valid).toEqual(true);
        });
    });

    describe('Controller', () => {
        let employeeHourlyRate, EmployeeModel, SettingModel, itemMock = {currencyCode: 'currencyCodeMock', currencySymbol: 'currencySymbolMock'};

        beforeEach(inject((_EmployeeModel_, _SettingModel_) => {
            EmployeeModel = _EmployeeModel_;
            SettingModel = _SettingModel_;
        }));

        it('should have employee property', () => {
            spyOn(EmployeeModel, 'getItem').and.returnValue(itemMock);
            spyOn(SettingModel, 'getItem');

            employeeHourlyRate = new EmployeeHourlyRate(EmployeeModel, SettingModel);

            expect(employeeHourlyRate.employee).toEqual(itemMock);
            expect(EmployeeModel.getItem).toHaveBeenCalled();
            expect(SettingModel.getItem).not.toHaveBeenCalled();
        });

        it(`should have employee.currencyCode set to setting currencyCode if employee.currencyCode is undefined`, () => {
            spyOn(EmployeeModel, 'getItem').and.returnValue({});
            spyOn(SettingModel, 'getItem').and.returnValue(itemMock);
            employeeHourlyRate = new EmployeeHourlyRate(EmployeeModel, SettingModel);

            expect(employeeHourlyRate.employee.currencyCode).toEqual(itemMock.currencyCode);
            expect(SettingModel.getItem).toHaveBeenCalled();
        });

        it(`should have employee.currencySymbol set to setting currencySymbol if employee.currencySymbol is undefined`, () => {
            spyOn(EmployeeModel, 'getItem').and.returnValue({});
            spyOn(SettingModel, 'getItem').and.returnValue(itemMock);
            employeeHourlyRate = new EmployeeHourlyRate(EmployeeModel, SettingModel);

            expect(employeeHourlyRate.employee.currencySymbol).toEqual(itemMock.currencySymbol);
            expect(SettingModel.getItem).toHaveBeenCalled();
        });
    });
});
