from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from airflow.contrib.operators.SSHExecuteOperator import SSHExecuteOperator

sshThing = SSHHook(conn_id='thing-ssh')
sshConcentrator = SSHHook(conn_id='concentrator-ssh')
sshHub = SSHHook(conn_id='hub-ssh')
sshCloud = SSHHook(conn_id='cloud-ssh')

dag = DAG('function-placement',description='Place functions on each box',
          schedule_interval = '0 * * * *',
          start_date=datetime(2017,8,14),catchup=False)

t1 = BashOperator(
        task_id='list_box',
        bash_command='./opt/airflow/dags/box_list.sh',
        dag=dag)

t2 = BashOperator(
        task_id='install_docker',
        bash_command='apt-get install docker-ce',
        dag=dag)

t3 = BashOperator(
        task_id='set_repository',
        bash_command='docker run -d -p 5000:5000 --restart=always --name registry registry:2',
        dag=dag)

t4_1 = SSHExecuteOperator(
        task_id='pull_functions_things',
        bash_command='docker pull registry/smartxenergy-flume',
        ssh_hook=sshThing,
        dag=dag)

t4_2 = SSHExecuteOperator(
        task_id='pull_functions_concentrator',
        bash_command='docker pull registry/smartxenergy-controller',
        ssh_hook=sshConcentrator,
        dag=dag)

t4_3 = SSHExecuteOperator(
        task_id='pull_functions_hub',
        bash_command='docker pull registry/smartxenergy-kafka',
        ssh_hook=sshHub,
        dag=dag)

t4_4 = SSHExecuteOperator(
        task_id='pull_functions_cloud',
        bash_command='docker pull registry/smartxenergy-influxdb',
        ssh_hook=sshCloud,
        dag=dag)

t5 = BashOperator(
        task_id='finish',
        bash_command='./opt/airflow/dags/finish.sh',
        dag=dag)

t1.set_downstream(t2)
t2.set_downstream(t3)
t3.set_downstream(t4_1)
t3.set_downstream(t4_2)
t3.set_downstream(t4_3)
t3.set_downstream(t4_4)

t5.set_upstream(t4_1)
t5.set_upstream(t4_2)
t5.set_upstream(t4_3)
t5.set_upstream(t4_4)